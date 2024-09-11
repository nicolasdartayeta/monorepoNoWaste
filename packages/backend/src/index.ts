import { Elysia } from "elysia";
import { logger } from "./controllers/logger";
import swagger from "@elysiajs/swagger";
import { loginController } from "./controllers/login";
import { userController } from "./controllers/users";

const app = new Elysia()
  .use(logger())
  .use(swagger())
  .use(loginController)
  .use(userController)
  .get("/", () => "Hola bobina")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
