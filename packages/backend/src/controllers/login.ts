import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";
import { addUser } from "@server/src/models/userFunctions";
import { userInsertDTO } from "@server/src/types";

export const loginController = new Elysia({ prefix: "user" })
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET as string,
    }),
  )
  .post(
    "/signup",
    async ({ body }) => {
      // Agarrar el ususario del body
      const newUser = body;

      // Hashear la contraseña
      newUser.password = await Bun.password.hash(newUser.password);

      // Persistir ususario en la DB
      const result = await addUser(newUser);
      return { agregado: result };
    },
    {
      body: userInsertDTO,
      detail: {
        summary: "Sign up a new user",
        tags: ["authentication"],
      },
    },
  )
  .get("/logout", ({ cookie: { auth } }) => {
    // Borrar el jwt de la cookie
    auth.remove();

    // Habria que redirigir al home
    // redirect("/", 301);

    return "redirigir a /home";
  });
