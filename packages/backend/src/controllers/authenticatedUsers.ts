import { Elysia } from "elysia";
import { getAllUsers, deleteUser } from "@server/src/models/userFunctions";

export const authenticatedUsersController = new Elysia({ prefix: "/user" })
  .get(
    "/all",
    async () => {
      return await getAllUsers();
    },
    {
      detail: {
        summary: "Get all users in DB",
        tags: ["user"],
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      const result = await deleteUser(id);
      return { eliminado: result };
    },
    {
      detail: {
        summary: "Delete a user",
        tags: ["user"],
      },
    },
  );
