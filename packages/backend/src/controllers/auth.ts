import jwt from "@elysiajs/jwt";
import Elysia, { redirect, t } from "elysia";
import {
  addUser,
  addUserIdentity,
  existisUserIdentity,
  getUserByEmail,
} from "@server/src/models/userFunctions";

import { NewUserIdentity } from "@server/db/schema";
import { CallbackParamsType, generators } from "openid-client";
import { GoogleClient } from "@server/src/utils/auth";

export const authController = new Elysia({ prefix: "auth" })
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET as string,
    }),
  )
  .get(
    "/password",
    async ({ body, jwt, cookie }) => {
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
          cookie.auth.value = await jwt.sign({
            user: user.id,
            type: user.type,
          });
          cookie.auth.httpOnly = true;
          cookie.auth.sameSite = true;
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
          const nonce = generators.nonce();

          authRequest.value = await jwt.sign({
            nonce: nonce,
          });

          const authURL = GoogleClient.authorizationUrl({
            scope: "openid email profile",
            response_mode: "form_post",
            nonce,
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
      .post(
        "/callback",
        async ({
          jwt,
          body: { id_token },
          cookie: { authRequest, auth },
          request,
        }) => {
          const nonce = await jwt.verify(authRequest.value);
          authRequest.remove();

          if (!nonce)
            return "No hay JWT con authrequest o no coincide con el state devuelto por google!";

          const params: CallbackParamsType = { id_token };

          const tokenSet = await GoogleClient.callback(request.url, params, {
            nonce: nonce.nonce as string,
          });

          const userIdentityData = tokenSet.claims();

          if (!userIdentityData.email)
            return "No se aceptan proveedores que no proporcionen email";

          // Nico hizo un diagrama de flujo de como va el login. Verlo antes de tocar el codigo
          let user = await getUserByEmail(userIdentityData.email);

          if (!user) {
            // agregarlo a la db
            const newUser = {
              type: "client" as "admin" | "client" | "merchant",
              firstname: userIdentityData.given_name
                ? userIdentityData.given_name
                : "sin nombre",
              lastname: userIdentityData.family_name
                ? userIdentityData.family_name
                : "sin apellido",
              email: userIdentityData.email,
            };

            user = await addUser(newUser);
          }

          // Si no esta el proveedor asociado al mail guardarlo
          if (
            !(await existisUserIdentity(
              userIdentityData.sub,
              userIdentityData.iss,
            ))
          ) {
            const userIdentity: NewUserIdentity = {
              user_id: user.id,
              provider_id: userIdentityData.sub,
              provider: userIdentityData.iss,
            };
            addUserIdentity(userIdentity);
          }

          // Agregar JWT de authentication a la cookie
          auth.value = await jwt.sign({
            user: user.id,
            type: user.type,
          });
          auth.httpOnly = true;
          auth.sameSite = true;

          return { message: "Logueado" };
        },
        {
          body: t.Object({
            id_token: t.String(),
          }),
          cookie: t.Cookie({
            authRequest: t.String(),
          }),
          detail: {
            summary: "Callback for google OAuth",
            tags: ["authentication"],
          },
        },
      ),
  );
