import { Elysia } from "elysia";
import { getAllUsers } from "@server/src/models/userFunctions";

export const userController = new Elysia({ prefix: "/user" }).get(
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
