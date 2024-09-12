import { Elysia } from "elysia";
import { logger } from "./controllers/logger";
import { swagger } from "@elysiajs/swagger";
import { loginController } from "./controllers/login";
import { userController } from "./controllers/users";
import { commerceController } from "./controllers/commerce";

const app = new Elysia()
  .use(logger())
  .use(swagger())
  .use(loginController)
  .use(userController)
  .use(commerceController)
  .get("/", () => "Hola bobina")
  .onError(({ code }) => {
    if (code === 'NOT_FOUND')
        return 'Ruta no encontrada :('
  })
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
