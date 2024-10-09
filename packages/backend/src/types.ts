import { createInsertSchema } from "drizzle-typebox";
import { commerce } from "@server/db/schema";
import { product, user, mailSubscription } from "@server/db/schema";
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
  "commerce_id",
]);
export const productDTO = t.Required(productInsertSchema, [
  "id",
  "commerce_id",
]);

const updProduct = createInsertSchema(product);
export const productUpdateDTO = t.Required(updProduct, ["id"]);

export const mailSubscriptionInsertSchema =
  createInsertSchema(mailSubscription);
export const mailSubscriptionDTO = t.Required(mailSubscriptionInsertSchema, [
  "mail",
]);
