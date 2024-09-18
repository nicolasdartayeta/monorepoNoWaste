import { purchase, purchaseHasProduct, NewPurchase, Product, user  } from "@server/db/schema";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { db } from "@server/db/db";
import { eq } from "drizzle-orm";

export const purchasesDTO = createInsertSchema(purchase);
export const purchaseInsertDTO = t.Omit(purchasesDTO, ["id"]);

const purchaseProduct = createInsertSchema(purchaseHasProduct);
export const purchaseProductInsertDTO = t.Omit(purchaseProduct, []);

export async function addPurchase(purchas: NewPurchase, productos: Product[]): Promise<string> {
  //check if user exists
  const userExists = await db.select().from(user).where(eq(user.id, purchase.user_id)) //MODELO DE USUARIO
  if (!userExists){
    return "error addpurchase"; //error
  }
  const result = (await db.insert(purchase).values(purchas).returning())[0];
  if (result) {
    addPurchaseHasProduct(result.id, productos);
    return result.id;
  } else {
    return "error addpurchase";
  }
}

export async function aprovePurchase(purchaseId: string): Promise<boolean> {
  const result = (await db.update(purchase).set({state : "approved"}).where(eq(purchase.id, purchaseId)));
  if (result) {
    return true;
  } else {
    return false;
  }
}

async function addPurchaseHasProduct(purchaseId: string, purchaseProduct: Product[]): Promise<boolean> {
  const purchaseProductData = purchaseProduct.map(product=> ({
    purchase_id: purchaseId,
    product_id: product.id,
  }));
  const result = (await db.insert(purchaseHasProduct).values(purchaseProductData).returning());
  if (result) {
    return true;
  } else {
    return false;
  }
}