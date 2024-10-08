import { sql, SQL } from "drizzle-orm";
import {
  boolean,
  date,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
  text,
  uniqueIndex,
  AnyPgColumn,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    type: varchar("type", { enum: ["admin", "client", "merchant"] }).notNull(),
    firstname: varchar("name", { length: 30 }).notNull(),
    lastname: varchar("lastname", { length: 30 }).notNull(),
    email: text("email"),
    password: text("password"),
  },
  (table) => ({
    emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(lower(table.email)),
  }),
);

export type User = typeof user.$inferSelect; // return type when queried
export type NewUser = typeof user.$inferInsert; // insert type

export const userIdentity = pgTable("userIdentity", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id),
  provider: varchar("provider", { length: 100 }).notNull(),
  provider_id: varchar("provider_id", { length: 100 }).notNull(),
  email: text("email"),
  created_at: timestamp("creation_date").notNull().defaultNow(),
});

export type UserIdentity = typeof userIdentity.$inferSelect; // return type when queried
export type NewUserIdentity = typeof userIdentity.$inferInsert; // insert type

export const commerce = pgTable("commerce", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 30 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  address: varchar("address", { length: 100 }).notNull(),
  city: varchar("city", { length: 30 }).notNull(),
  creation_date: timestamp("creation_date").notNull().defaultNow(),
  active: boolean("active").notNull().default(true),
  owner_id: uuid("owner_id")
    .notNull()
    .references(() => user.id),
});

export type Commerce = typeof commerce.$inferSelect; // return type when queried
export type NewCommerce = typeof commerce.$inferInsert; // insert type

export const product = pgTable("product", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 30 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  price: varchar("price", { length: 30 }).notNull(),
  expiration_date: date("expiration_date").notNull(),
  collection_id: uuid("collection_id")
    .notNull()
    .references(() => collections.id),
});

export type Product = typeof product.$inferSelect; // return type when queried
export type NewProduct = typeof product.$inferInsert; // insert type

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 30 }).notNull(),
  owner_id: uuid("owner_id")
    .notNull()
    .references(() => commerce.id),
});

export type Collection = typeof collections.$inferSelect; // return type when queried
export type NewCollection = typeof collections.$inferInsert; // insert type

export const proudctCategory = pgTable("product_category", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 30 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
});

export type ProductCategory = typeof proudctCategory.$inferSelect; // return type when queried
export type NewProductCategory = typeof proudctCategory.$inferInsert; // insert type

export const productHasCategory = pgTable(
  "product_has_category",
  {
    product_id: uuid("product_id")
      .notNull()
      .references(() => product.id),
    category_id: uuid("category_id")
      .notNull()
      .references(() => proudctCategory.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.product_id, table.category_id] }),
    };
  },
);

export type ProductHasCategory = typeof productHasCategory.$inferSelect; // return type when queried
export type NewProductHasCategory = typeof productHasCategory.$inferInsert; // insert type

export const purchase = pgTable("purchase", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id),
  state: varchar("state", { length: 30 }).notNull(),
  purchase_date: timestamp("purchase_date").notNull().defaultNow(),
});

export type Purchase = typeof purchase.$inferSelect; // return type when queried
export type NewPurchase = typeof purchase.$inferInsert; // insert type

export const purchaseHasProduct = pgTable(
  "purchase_has_product",
  {
    purchase_id: uuid("purchase_id")
      .notNull()
      .references(() => purchase.id),
    product_id: uuid("product_id")
      .notNull()
      .references(() => product.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.purchase_id, table.product_id] }),
    };
  },
);

export type PurchaseHasProduct = typeof purchaseHasProduct.$inferSelect; // return type when queried
export type NewPurchaseHasProduct = typeof purchaseHasProduct.$inferInsert; // insert type

// custom lower function
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
