import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";
import { addUser } from "@server/src/models/userFunctions";
import { userInsertDTO } from "@server/src/types";
import { addUserRole } from "../utils/role";

export const unauthenticatedUsersController = new Elysia({ prefix: "user" })
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET as string,
    }),
  )
  .post(
    "/signup/client",
    async ({ body }) => {
      // Agarrar el ususario del body
      const newUser = body;
      if (newUser.password) {
        // Hashear la contraseña
        newUser.password = await Bun.password.hash(newUser.password);
        // Persistir ususario en la DB
        const result = await addUser(newUser);

        await addUserRole(result.id, "client");

        return { agregado: result };
      }
      return { error: "no se especifico una contraseña" };
    },
    {
      body: userInsertDTO,
      detail: {
        summary: "Sign up a new user",
        tags: ["user"],
      },
    },
  )
  .post(
    "/signup/commerce",
    async ({ body }) => {
      // Agarrar el usuario del body
      const newUser = body;
      if (newUser.password) {
        // Hashear la contraseña
        newUser.password = await Bun.password.hash(newUser.password);
        // Persistir ususario en la DB
        const result = await addUser(newUser);

        await addUserRole(result.id, "commerce");

        return { agregado: result };
      }
      return { error: "no se especifico una contraseña" };
    },
    {
      body: userInsertDTO,
      detail: {
        summary: "Sign up a new user",
        tags: ["user"],
      },
    },
  )
  .get(
    "/logout",
    ({ cookie: { auth } }) => {
      // Borrar el jwt de la cookie
      auth.remove();

      // Habria que redirigir al home
      // redirect("/", 301);

      return "redirigir a /home";
    },
    {
      detail: {
        summary: "Log out user",
        tags: ["user"],
      },
    },
  );
