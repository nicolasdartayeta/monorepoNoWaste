import { createInsertSchema } from "drizzle-typebox";
import { commerce } from "@server/db/schema";
import { product, user } from "@server/db/schema";
import { t } from "elysia";

const userInsertSchema = createInsertSchema(user);
export const userInsertDTO = t.Omit(userInsertSchema, ["id"]);

const Commerce = createInsertSchema(commerce);
export const commerceInsertDTO = t.Omit(Commerce, [
  "id",
  "creation_date",
  "active",
]);

const updCommerce = createInsertSchema(commerce);
export const commerceUpdateDTO = t.Required(updCommerce, ["id"]);

export const productInsertSchema = createInsertSchema(product);
export const productInsertDTO = t.Omit(productInsertSchema, [
  "id",
  "collection_id",
]);
export const productDTO = t.Required(productInsertSchema, [
  "id",
  "collection_id",
]);
