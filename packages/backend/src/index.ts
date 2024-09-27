import { Elysia } from "elysia";
import { logger } from "@server/src/controllers/logger";
import { swagger } from "@elysiajs/swagger";
import { unauthenticatedUsersController } from "@server/src/controllers/unauthenticatedUsers";
import { authenticatedUsersController } from "@server/src/controllers/authenticatedUsers";
import jwt from "@elysiajs/jwt";
import { commerceController } from "@server/src/controllers/commerce";
// import { productController } from "@server/src/controllers/product";
import { cors } from "@elysiajs/cors";
import { authController } from "@server/src/controllers/auth";
import { productController } from "@server/src/controllers/product";

const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET as string,
    }),
  )
  .get("/", () => {
    return "gordo puto";
  })
  .use(cors()) // Enable CORS
  .use(logger())
  .use(swagger())
  .use(authController)
  .use(unauthenticatedUsersController)
  .use(commerceController)
  .use(authenticatedUsersController)
  .use(productController)
  .guard(
    {
      async beforeHandle({ jwt, cookie: { auth } }) {
        const user = await jwt.verify(auth.value);

        if (!user) return "Authenticate first";
      },
    },
    (app) => app,
    
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
