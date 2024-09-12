import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import { getUserByEmail } from "../models/userFunctions";

export const loginController = new Elysia({ prefix: "/login" })
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET as string,
    }),
  )
  .post(
    "/",
    async ({ body, jwt, cookie: { auth } }) => {
      const user = await getUserByEmail(body.email);

      if (user) {
        const correctPassword = await Bun.password.verify(
          body.password,
          user.password,
        );

        if (correctPassword) {
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
        summary: "Sign in the user",
        tags: ["authentication"],
      },
    },
  );
