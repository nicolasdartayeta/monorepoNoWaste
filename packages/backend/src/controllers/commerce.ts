import { Elysia } from "elysia";
import { addCommerce } from "@server/src/models/commerceFunctions";
import { commerceInsertDTO } from "@server/src/types";

export const commerceController = new Elysia({ prefix: "/commerce" })
  .post(
    "/add",
    async ({ body }) => {
      const newCommerce = body;
      const result = await addCommerce(newCommerce);
      return { agregado: result };
    },
    {
      body: commerceInsertDTO,
      detail: "Insert a new commerce",
      tags: ["commerces"],
    },
  )
  .get("/", () => "QUE PASA TITAN");
