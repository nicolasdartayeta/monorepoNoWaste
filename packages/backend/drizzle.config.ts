import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema/*",
  out: "./db/drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgres://admin:admin@postgres:5432/NoWaste",
  }
});
