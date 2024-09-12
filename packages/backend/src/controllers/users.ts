import { Elysia } from "elysia";
import { addUser, getAllUsers } from "../models/userFunctions";
import { userInsertDTO } from "@server/src/types";

export const userController = new Elysia({ prefix: "/user" })
  .post(
    "/signup",
    async ({ body }) => {
      const newUser = body;
      newUser.password = await Bun.password.hash(newUser.password); //Encripta password
      const result = await addUser(newUser);
      return { agregado: result };
    },
    {
      body: userInsertDTO,
      detail: {
        summary: "Sign up a new user",
        tags: ["users"],
      },
    },
  )
  .get(
    "/all",
    async () => {
      return await getAllUsers();
    },
    {
      detail: {
        summary: "Get all users in DB",
        tags: ["users"],
      },
    },
  );
