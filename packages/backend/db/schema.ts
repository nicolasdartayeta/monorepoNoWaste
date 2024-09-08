import {
  boolean,
  date,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  type: varchar("type", { enum: ["admin", "client", "merchant"] }).notNull(),
  firstname: varchar("name", { length: 30 }).notNull(),
  lastname: varchar("lastname", { length: 30 }).notNull(),
  email: varchar("email", { length: 50 }).notNull(),
  password: varchar("password", { length: 100 }).notNull(),
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type

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
    .references(() => users.id),
});

export type Commerce = typeof commerce.$inferSelect; // return type when queried
export type NewCommerce = typeof commerce.$inferInsert; // insert type

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 30 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  price: varchar("price", { length: 30 }).notNull(),
  expiration_date: date("expiration_date").notNull(),
  collection_id: uuid("collection_id")
    .notNull()
    .references(() => collections.id),
});

export type Product = typeof products.$inferSelect; // return type when queried
export type NewProduct = typeof products.$inferInsert; // insert type

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
      .references(() => products.id),
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

export const purchases = pgTable("purchases", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  state: varchar("state", { length: 30 }).notNull(),
  purchase_date: timestamp("purchase_date").notNull().defaultNow(),
});

export type Purchase = typeof purchases.$inferSelect; // return type when queried
export type NewPurchase = typeof purchases.$inferInsert; // insert type

export const purchaseHasProduct = pgTable(
  "purchase_has_product",
  {
    purchase_id: uuid("purchase_id")
      .notNull()
      .references(() => purchases.id),
    product_id: uuid("product_id")
      .notNull()
      .references(() => products.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.purchase_id, table.product_id] }),
    };
  },
);

export type PurchaseHasProduct = typeof purchaseHasProduct.$inferSelect; // return type when queried
export type NewPurchaseHasProduct = typeof purchaseHasProduct.$inferInsert; // insert type
