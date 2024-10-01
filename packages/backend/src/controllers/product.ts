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
      detail: {
        summary: "Insert a new Product",
        tags: ["products"],
      },
    },
  )
  .get(
    "/",
    async ({ query }) => {
      if (query.name) {
        return await getAllProductsByFilter(query.name);
      } else {
        return await getAllProducts();
      }
    },
    {
      detail: {
        summary: "Get a product by filter || getAll()",
        tags: ["products"],
      },
    },
  )
  .get(
    "/:id",
    async (req) => {
      const { id } = req.params;
      return await getProductById(id);
    },
    {
      detail: {
        summary: "Get a product using ID",
        tags: ["products"],
      },
    },
  )
  .get(
    "/total-products",
    async () => {
      const result = await db.select().from(product);
      return result.length;
    },
    {
      detail: {
        summary: "Get total products",
        tags: ["products"],
      },
    },
  )
  .put(
    "/:id",
    async ({ body }) => {
      const toUpdate = body;
      const result = await updateProduct(toUpdate);
      return result;
    },
    {
      body: productUpdateDTO,
      detail: {
        summary: "Update a product",
        tags: ["products"],
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      return await deleteProduct(id);
    },
    {
      detail: {
        summary: "Delete a product",
        tags: ["products"],
      },
    },
  );
