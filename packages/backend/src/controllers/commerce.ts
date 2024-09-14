import { Elysia } from "elysia";
import {
  addCommerce,
  getAllCommerces,
  deleteCommerce,
} from "@server/src/models/commerceFunctions";
import { commerceInsertDTO } from "@server/src/types";

export const commerceController = new Elysia({ prefix: "/commerce" })
  .post(
    "/",
    async ({ body }) => {
      const newCommerce = body;
      const result = await addCommerce(newCommerce);
      return { agregado: result };
    },
    {
      body: commerceInsertDTO,
      detail: {
        summary: "Insert a new commerce",
        tags: ["commerces"],
      },
    },
  )
  .get(
    "/",
    async () => {
      return await getAllCommerces();
    },
    {
      detail: {
        summary: "Get all commerces in DB",
        tags: ["commerces"],
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      const result = await deleteCommerce(id);
      return { eliminado: result };
    },
    {
      detail: {
        summary: "Delete a commerce",
        tags: ["commerces"],
      },
    },
  );
/**
    .put("/:id",
        async ({body}) => {
            const updateCommerce = body;
        },
        {
            body: commerceInsertDTO
        }
    )
    */
