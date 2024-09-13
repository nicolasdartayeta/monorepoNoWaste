import { Elysia } from "elysia";
import { logger } from "./controllers/logger";
import swagger from "@elysiajs/swagger";
import { loginController } from "./controllers/login";
import { userController } from "./controllers/users";
import { productController } from "./controllers/product";
import { cors } from '@elysiajs/cors'; // Install with npm install @elysiajs/corsc

export const app = new Elysia()
  .use(cors()) // Enable CORS
  .use(logger())
  .use(swagger())
  .use(loginController)
  .use(userController)
  .use(productController)
  .get("/", () => "Hola bobina")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
