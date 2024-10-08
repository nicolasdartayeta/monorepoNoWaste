import { Elysia } from "elysia";
import {
  addCommerce,
  getAllCommerces,
  deleteCommerce,
  getCommerceById,
  updateCommerce,
  getCommerceByFilter,
} from "@server/src/models/commerceFunctions";
import { commerceInsertDTO, commerceUpdateDTO } from "@server/src/types";

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
    async ({ query }) => {
      if (query.name || query.city || query.address) {
        return await getCommerceByFilter(query.name, query.city, query.address); //Filtra solo por los parametros que se le indica. Chequear como hacer para que sea general.
      }

      return await getAllCommerces();
    },
    {
      detail: {
        summary: "Get all commerces in DB",
        tags: ["commerces"],
      },
    },
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return await getCommerceById(id);
    },
    {
      detail: {
        summary: "Get a commerce",
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
  )
  .put(
    "/:id",
    async ({ body }) => {
      const updCommerce = body;
      const result = await updateCommerce(updCommerce);
      return { actualizado: result };
    },
    {
      body: commerceUpdateDTO,
      detail: {
        summary: "Update a commmerce",
        tags: ["commerces"],
      },
    },
  );
