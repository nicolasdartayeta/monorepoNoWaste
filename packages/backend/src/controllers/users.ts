import { Elysia } from "elysia";
import { getAllUsers } from "@server/src/helpers/userFunctions";
import { userInsertDTO } from "@server/src/types";

export const userController = new Elysia({ prefix: "/user" })
  .post(
    "/signup",
    ({ body }) => {
      return body;
    },
    {
      body: userInsertDTO,
      detail: {
        summary: "Sign up a new user",
        tags: ["users"],
      },
    },
  )
  .get("all", async () => {
    return await getAllUsers();
  });
