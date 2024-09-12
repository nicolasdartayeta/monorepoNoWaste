import { createInsertSchema } from "drizzle-typebox";
import { users } from "@server/db/schema";
import { commerce } from "@server/db/schema";
import { t } from "elysia";

const user = createInsertSchema(users);
export const userInsertDTO = t.Omit(user, ["id"]);

const Commerce = createInsertSchema(commerce);
export const commerceInsertDTO = t.Omit(Commerce, [
  "id",
  "creation_date",
  "active",
]);
