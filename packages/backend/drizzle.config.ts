import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "postgres",
    user: "admin",
    password: "admin",
    database: "NoWaste",
  },
});
