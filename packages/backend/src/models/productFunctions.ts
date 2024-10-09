import { commerce, NewProduct, Product, product } from "@server/db/schema";
import { eq, and, ilike } from "drizzle-orm";
import { db } from "@server/db/db";

export async function addProduct(prod: NewProduct) {
  if (
    !prod.name ||
    !prod.description ||
    !prod.price ||
    !prod.expiration_date ||
    !prod.commerce_id
  ) {
    return { error: "Se requieren todos los aprametros" };
  }
  try {
    const commerceExists = await db.query.commerce.findFirst({
      where: eq(commerce.id, prod.commerce_id),
    });
    if (commerceExists) {
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
}

export async function getAllProductsByFilter(
  name?: string,
  commerceId?: string,
) {
  try {
    const result = await db
      .select()
      .from(product)
      .where(
        and(
          name ? ilike(product.name, `%${name}%`) : undefined,
          commerceId ? eq(product.commerce_id, commerceId) : undefined,
        ),
      );
    if (result.length > 0) {
      return result;
    } else {
      return {
        message: "No hay productos en la base de datos que cumplan el filtro",
      };
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
    !prod.commerce_id
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
