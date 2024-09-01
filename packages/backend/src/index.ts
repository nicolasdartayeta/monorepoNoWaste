import { Elysia } from "elysia";
import { logger } from "@server/logger";

const app = new Elysia()
  .use(logger())
  .get("/", () => "Hola bobo").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
