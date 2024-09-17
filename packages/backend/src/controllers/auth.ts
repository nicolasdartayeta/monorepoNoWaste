import jwt from "@elysiajs/jwt";
import Elysia, { redirect, t } from "elysia";
import { getUserByEmail } from "@server/src/models/userFunctions";

import { google } from "googleapis";
import { randomBytes } from "crypto";

const googleOauthFile = await Bun.file("clienteGoogle.json").json();

const oauth2ClientGoogle = new google.auth.OAuth2(googleOauthFile);

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
      if (user) {
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
          description: "Expected an username and password",
        },
      ),
      detail: {
        summary: "Sign in the user with password",
        tags: ["authentication"],
      },
    },
  )
  .group("/google", (app) =>
    app.get(
      "",
      () => {
        const state = randomBytes(32).toString("hex");
        const authURL = oauth2ClientGoogle.generateAuthUrl({
          scope: scopes,
          include_granted_scopes: true,
          state: state,
        });

        redirect(authURL);
      },
      {
        detail: {
          summary: "Sign in the user with google",
          tags: ["authentication"],
        },
      },
    ),
  );
