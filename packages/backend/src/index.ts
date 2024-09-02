import { Elysia } from "elysia";
import { logger } from "@server/logger";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
  .use(logger())
  .use(swagger())
  .get("/", () => "Hola")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
