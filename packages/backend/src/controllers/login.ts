import { Elysia, t } from "elysia";
import { db } from "@server/db/db";
import { users } from "@server/db/schema";
import { eq } from "drizzle-orm";

export const loginController = new Elysia({ prefix: "/login" }).post(
  "/",
  async ({ body }) => {
    const user = (
      await db.select().from(users).where(eq(users.email, body.email))
    )[0];

    if (user) {
      const correctPassword = await Bun.password.verify(
        body.password,
        user.password,
      );

      if (correctPassword) {
        return { message: "Logueado!" };
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
