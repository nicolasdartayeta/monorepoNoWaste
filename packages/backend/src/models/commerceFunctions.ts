import { NewCommerce, Commerce, commerce } from "@server/db/schema";
import { db } from "@server/db/db";
import { eq, and } from "drizzle-orm";

export async function getAllCommerces() {
  return await db.select().from(commerce);
}

export async function getCommerceById(commerceId: string) {
  return await db.select().from(commerce).where(eq(commerce.id, commerceId));
}

export async function addCommerce(Commerce: NewCommerce): Promise<boolean> {
  const result = await db.insert(commerce).values(Commerce).returning();
  if (result) {
    return true;
  } else {
    return false;
  }
}

export async function deleteCommerce(commerceId: string): Promise<boolean> {
  const result = await db
    .delete(commerce)
    .where(eq(commerce.id, commerceId))
    .returning();
  if (result) {
    return true;
  } else {
    return false;
  }
}

export async function updateCommerce(commerceUpd: Commerce) {
  //Chequear como hacer para que no sea necesario que se mande todo el objeto en la req
  const result = await db
    .update(commerce)
    .set(commerceUpd)
    .where(eq(commerce.id, commerceUpd.id))
    .returning();
  if (result) {
    return true;
  } else {
    return false;
  }
}

export async function getCommerceByFilter(
  Name?: string,
  City?: string,
  Address?: string,
) {
  const result = await db
    .select()
    .from(commerce)
    .where(
      and(
        Name ? eq(commerce.name, Name) : undefined,
        City ? eq(commerce.city, City) : undefined,
        Address ? eq(commerce.address, Address) : undefined,
      ),
    );
  return result;
}
