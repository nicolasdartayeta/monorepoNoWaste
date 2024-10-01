import { Elysia } from "elysia";
import { db } from "@server/db/db";
import { product } from "@server/db/schema";
import { productInsertDTO, productUpdateDTO } from "../types";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsByFilter,
  getProductById,
  updateProduct,
} from "@server/src/models/productFunctions";

export const productController = new Elysia({ prefix: "/product" })
  .post(
    "/",
    async ({ body }) => {
      const newProduct = body;
      const result = await addProduct(newProduct);
      return result;
    },
    {
      body: productInsertDTO,
      description:
        "Se espera: name, description, price, expiration_date, and collection_id",
    },
  )
  .get("/", async ({ query }) => {
    if (query.name) {
      return await getAllProductsByFilter(query.name);
    } else {
      return await getAllProducts();
    }
  })
  .get("/:id", async (req) => {
    const { id } = req.params;
    return await getProductById(id);
  })
  .get("/total-products", async () => {
    const result = await db.select().from(product);
    return result.length;
  })
  .put(
    "/:id",
    async ({ body }) => {
      const toUpdate = body;
      const result = await updateProduct(toUpdate);
      return result;
    },
    {
      body: productUpdateDTO,
      description:
        "Se espera: name, description, price, expiration_date, y collection_id",
    },
  )
  .delete("/:id", async ({ params: { id } }) => {
    return await deleteProduct(id);
  });
