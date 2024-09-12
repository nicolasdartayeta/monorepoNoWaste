import { NewCommerce, commerce } from "@server/db/schema";
import { db } from "@server/db/db";
import { eq } from "drizzle-orm";

export async function getAllCommerces(){
    return await db.select().from(commerce);
}

export async function addCommerce(Commerce: NewCommerce): Promise<boolean> {
  const result = await db.insert(commerce).values(Commerce).returning();
  if (result) {
    return true;
  } else {
    return false;
  }
}

export async function deleteCommerce(commerceId: string){
    const result = (await db.delete(commerce).where(eq(commerce.id, commerceId)).returning());
    if (result){
        return true;
    } else {
        return false;
    }
}
/**
export async function updateCommerce(Commerce: commerce){
    const result = (await db.update(commerce).set(Commerce).where(eq(commerce.id, Commerce.id)).returning());
    if (result){
        return true;
    } else {
        return false;
    }
}
*/