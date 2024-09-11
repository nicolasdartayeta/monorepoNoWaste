import { createInsertSchema } from "drizzle-typebox";
import { users } from "@server/db/schema";
import { t } from "elysia";

const user = createInsertSchema(users);
export const userInsertDTO = t.Omit(user, ["id"]);
