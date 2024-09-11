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

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 30 }).notNull(),
  owner_id: uuid("owner_id")
    .notNull()
    .references(() => commerce.id),
});

export const proudctCategory = pgTable("product_category", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 30 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
});

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

export const purchases = pgTable("purchases", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  state: varchar("state", { length: 30 }).notNull(),
  purchase_date: timestamp("purchase_date").notNull().defaultNow(),
});

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
