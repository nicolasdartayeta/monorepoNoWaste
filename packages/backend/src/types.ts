import { createInsertSchema } from "drizzle-typebox";
import { commerce } from "@server/db/schema";
import { products, users } from "@server/db/schema";
import { t } from "elysia";

const user = createInsertSchema(users);
export const userInsertDTO = t.Omit(user, ["id"]);

const Commerce = createInsertSchema(commerce);
export const commerceInsertDTO = t.Omit(Commerce, [
  "id",
  "creation_date",
  "active",
]);

const updCommerce = createInsertSchema(commerce);
export const commerceUpdateDTO = t.Required(updCommerce, ["id"]);

const product = createInsertSchema(products);
export const productInsertDTO = t.Omit(product, ["id", "collection_id"]);
