import jwt from "@elysiajs/jwt";
import Elysia, { redirect, t } from "elysia";
import {
  addUser,
  addUserIdentity,
  getUserByEmail,
  getUserByIdentityProvider,
} from "@server/src/models/userFunctions";

import { google } from "googleapis";
import { randomBytes } from "crypto";
import { NewUserIdentity } from "@server/db/schema";

const googleOauthFile = await Bun.file("clienteGoogle.json").json();

const oauth2ClientGoogle = new google.auth.OAuth2(
  googleOauthFile.web.client_id,
  googleOauthFile.web.client_secret,
  googleOauthFile.web.redirect_uris[0],
);

const scopes = ["openid"];

export const authController = new Elysia({ prefix: "auth" })
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET as string,
    }),
  )
  .get(
    "/password",
    async ({ body, jwt, cookie: { auth } }) => {
      // Agarrar el usuario por su email (se usa como identificador). Habria que ver si se puede loguear con nombre de usuario como hacer
      const user = await getUserByEmail(body.email);

      // Si hay un usuario proceder a chequear la contraseña
      if (user && user.password) {
        const correctPassword = await Bun.password.verify(
          body.password,
          user.password,
        );

        if (correctPassword) {
          // Agregar JWT de authentication a la cookie
          auth.value = await jwt.sign({
            user: user.id,
            type: user.type,
          });
          auth.httpOnly = true;
          auth.sameSite = true;
          return { message: "Logueado" };
        }
      }

      return { message: "Usuario o constaseña incorrecta" };
    },
    {
      body: t.Object(
        {
          email: t.String(),
          password: t.String(),
        },
        {
          description: "Expected a username and password",
        },
      ),
      detail: {
        summary: "Sign in the user with password",
        tags: ["authentication"],
      },
    },
  )
  .group("/google", (app) =>
    app
      .get(
        "",
        async ({ jwt, cookie: { authRequest } }) => {
          const state = randomBytes(32).toString("hex");

          authRequest.value = await jwt.sign({
            state: state,
          });

          const authURL = oauth2ClientGoogle.generateAuthUrl({
            scope: scopes,
            include_granted_scopes: true,
            state: state,
          });

          console.log("redirigido");
          return redirect(authURL, 301);
        },
        {
          detail: {
            summary: "Sign in the user with google",
            tags: ["authentication"],
          },
        },
      )
      .get(
        "/callback",
        async ({ jwt, cookie: { authRequest, auth }, query }) => {
          // codigo que devuelve google como queryParam con el que desp se piden los tokens
          const code = query.code;

          const JWTstate = await jwt.verify(authRequest.value);

          if (JWTstate && JWTstate.state === query.state) {
            // Eliminar JWT
            authRequest.remove();

            const { tokens } = await oauth2ClientGoogle.getToken(code);

            // verificar token de openid. el ticket tiene los datos del usuario
            const ticket = await oauth2ClientGoogle.verifyIdToken({
              idToken: tokens.id_token as string,
              audience: googleOauthFile.web.client_id,
            });

            const ticketPayload = ticket.getPayload();

            if (ticketPayload) {
              // checkear si ya se cuenta con el proveedor en la db
              let user = await getUserByIdentityProvider(
                ticketPayload.sub,
                ticketPayload.iss,
              );

              if (!user) {
                // checkear si hay algun usuario con ese mail
                user = await getUserByEmail(ticketPayload.email as string);

                if (!user) {
                  const newUser = {
                    type: "client" as "admin" | "client" | "merchant",
                    firstname: ticketPayload.given_name
                      ? ticketPayload.given_name
                      : "sin nombre",
                    lastname: ticketPayload.family_name
                      ? ticketPayload.family_name
                      : "sin apellido",
                    email: ticketPayload.email as string,
                  };

                  user = await addUser(newUser);
                }

                const userIdentity: NewUserIdentity = {
                  user_id: user.id,
                  provider_id: ticketPayload.sub,
                  provider: ticketPayload.iss,
                };

                await addUserIdentity(userIdentity);
              }

              // Agregar JWT de authentication a la cookie
              auth.value = await jwt.sign({
                user: user.id,
                type: user.type,
              });
              auth.httpOnly = true;
              auth.sameSite = true;

              return { message: "Logueado" };
            }
          }

          return {
            message:
              "No hay JWT con authrequest o no coincide con el state devuelto por google",
          };
        },
        {
          query: t.Object({
            state: t.String(),
            code: t.String(),
          }),
          detail: {
            summary: "Callback for google OAuth",
            tags: ["authentication"],
          },
        },
      ),
  );
