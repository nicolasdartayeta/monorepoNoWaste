import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  tipo: varchar("tipo", {
    enum: ["admin", "cliente", "comerciante"],
  }).notNull(),
  firstname: varchar("name", { length: 30 }).notNull(),
  lastname: varchar("lastname", { length: 30 }).notNull(),
  email: varchar("email", { length: 50 }).notNull(),
  password: varchar("password", { length: 100 }).notNull(),
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
