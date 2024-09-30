import { collections, NewProduct, Product, product } from "@server/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "@server/db/db";

export async function addProduct(prod: NewProduct) {
  if (
    !prod.name ||
    !prod.description ||
    !prod.price ||
    !prod.expiration_date ||
    !prod.collection_id
  ) {
    return { error: "Se requieren todos los aprametros" };
  }
  try {
    const collectionExists = await db.query.collections.findFirst({
      where: eq(collections.id, prod.collection_id),
    });
    if (collectionExists) {
      await db.insert(product).values(prod);
      return { message: "Producto agregado!" };
    } else {
      return { message: "No existe la colleccion de productos" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Error al agregar producto." };
  }
}

export async function getAllProducts() {
  try {
    const result = (await db.select().from(product));
    if (result.length > 0) {
      return result;
    } else {
      return { message: "No hay productos en la base de datos" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Error al obtener la lista de productos" };
  }
}

export async function getAllProductsByFilter( name? : string) {
  try {
    const result = await db.
      select().
      from(product).
      where(
        and(
          name ? eq(product.name, name) : undefined),
        );
    if (result.length > 0) {
      return result;
    } else {
      return { message: "No hay productos en la base de datos" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Error al obtener la lista de productos" };
  }
}

export async function getProductById(id: string) {
  try {
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
}

export async function updateProduct(prod: Product) {
  if (
    !prod.name ||
    !prod.description ||
    !prod.price ||
    !prod.expiration_date ||
    !prod.collection_id
  ) {
    return { error: "Se requieren todos los parametros." };
  }

  try {
    const updatedProduct = await db
      .update(product)
      .set(prod)
      .where(eq(product.id, prod.id))
      .returning();

    if (updatedProduct.length === 0) {
      return { error: `No se encontro producto con id: ${prod.id}` };
    }

    return {
      message: `Producto: ${prod.id} actualizado!`,
      updatedProduct: updatedProduct[0],
    };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar valores de producto" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.delete(product).where(eq(product.id, id));
  } catch (error) {
    console.error(error);
    return { error: "error al eliminar producto" };
  }
  return { message: `Se borro producto con id: ${id}` };
}
