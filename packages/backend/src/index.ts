import { Elysia } from "elysia";
import { logger } from "@server/src/controllers/logger";
import { swagger } from "@elysiajs/swagger";
import { loginController } from "@server/src/controllers/login";
import { userController } from "@server/src/controllers/users";
import jwt from "@elysiajs/jwt";
import { commerceController } from "@server/src/controllers/commerce";
// import { productController } from "@server/src/controllers/product";
import { cors } from "@elysiajs/cors";
import { authController } from "@server/src/controllers/auth";

const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET as string,
    }),
  )
  .use(cors()) // Enable CORS
  .use(logger())
  .use(swagger())
  .use(authController)
  .use(loginController)

  .guard(
    {
      async beforeHandle({ jwt, cookie: { auth } }) {
        const user = await jwt.verify(auth.value);

        if (!user) return "Authenticate first";
      },
    },
    (app) => app.use(userController).use(commerceController),
    // .use(productController),
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
