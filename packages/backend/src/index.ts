import { Elysia } from "elysia";
import { logger } from "./controllers/logger";
import { swagger } from "@elysiajs/swagger";
import { loginController } from "./controllers/login";
import { userController } from "./controllers/users";
import jwt from "@elysiajs/jwt";
import { commerceController } from "./controllers/commerce";

const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET as string,
    }),
  )
  .use(logger())
  .use(swagger())
  .use(loginController)
  .use(commerceController)
  .guard(
    {
      async beforeHandle({ jwt, cookie: { auth } }) {
        const user = await jwt.verify(auth.value);

        if (!user) return "Authenticate first";
      },
    },
    (app) => app.use(userController).get("/", () => "Hola bobina"),
  )
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
