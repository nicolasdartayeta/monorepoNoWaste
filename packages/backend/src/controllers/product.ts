import { Elysia, t } from "elysia";
import { db } from "@server/db/db";
import { collections, product } from "@server/db/schema";
import { eq } from "drizzle-orm";

export const productController = new Elysia({ prefix: "/product" })
  .post(
    "/",
    async ({ body }) => {
      const { name, description, price, expiration_date, collection_id } = body;

      if (
        !name ||
        !description ||
        !price ||
        !expiration_date ||
        !collection_id
      ) {
        return { error: "Se requieren todos los aprametros" };
      }

      const formattedDate = new Date(expiration_date)
        .toISOString()
        .split("T")[0];
      try {
        const collectionExists = await db.query.collections.findFirst({
          where: eq(collections.id, collection_id),
        });
        if (collectionExists) {
          await db.insert(product).values({
            name,
            description,
            price,
            expiration_date: formattedDate,
            collection_id,
          });
          return { message: "Producto agregado!" };
        } else {
          return { message: "No existe la colleccion de productos" };
        }
      } catch (error) {
        console.error(error);
        return { error: "Error al agregar producto." };
      }
    },
    {
      body: t.Object(
        {
          name: t.String(),
          description: t.String(),
          price: t.String(),
          expiration_date: t.String(),
          collection_id: t.String(),
        },
        {
          description:
            "Se espera: name, description, price, expiration_date, and collection_id",
        },
      ),
    },
  )
  .get("/", async () => {
    try {
      const result = await db.select().from(product);
      if (result.length > 0) {
        return result;
      } else {
        return { message: "No hay productos en la base de datos" };
      }
    } catch (error) {
      console.error(error);
      return { error: "Error al obtener la lista de productos" };
    }
  })
  .get("/:id", async (req) => {
    try {
      const { id } = req.params;
      const result = await db.select().from(product).where(eq(product.id, id));
      if (result.length > 0) {
        return result;
      } else {
        return { message: `No existe producto con id: ${id}` };
      }
    } catch (error) {
      console.error(error);
      return { error: "Error al mostrar" };
    }
  })
  .get("/total-products", async () => {
    const result = await db.select().from(product);
    return result.length;
  })
  .put(
    "/:id",
    async (req) => {
      const { id } = req.params;
      const { name, description, price, expiration_date, collection_id } =
        req.body;

      if (
        !name ||
        !description ||
        !price ||
        !expiration_date ||
        !collection_id
      ) {
        return { error: "Se requieren todos los parametros." };
      }

      try {
        const updatedProduct = await db
          .update(product)
          .set({
            name,
            description,
            price,
            expiration_date: new Date(expiration_date).toISOString(),
            collection_id,
          })
          .where(eq(product.id, id))
          .returning();

        if (updatedProduct.length === 0) {
          return { error: `No se encontro producto con id: ${id}` };
        }

        return {
          message: `Producto: ${id} actualizado!`,
          updatedProduct: updatedProduct[0],
        };
      } catch (error) {
        console.error(error);
        return { error: "Error al actualizar valores de producto" };
      }
    },
    {
      body: t.Object(
        {
          name: t.String(),
          description: t.String(),
          price: t.String(),
          expiration_date: t.String(),
          collection_id: t.String(),
        },
        {
          description:
            "Se espera: name, description, price, expiration_date, y collection_id",
        },
      ),
    },
  )
  .delete("/:id", async (req) => {
    const { id } = req.params;
    try {
      await db.delete(product).where(eq(product.id, id));
    } catch (error) {
      console.error(error);
      return { error: "error al eliminar producto" };
    }
    return { message: `Se borro producto con id: ${id}` };
  });
