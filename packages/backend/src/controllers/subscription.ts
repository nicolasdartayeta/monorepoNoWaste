import Elysia from "elysia";
import { addSubscription } from "../models/subscriptionFunctions";
import { mailSubscriptionDTO } from "../types";
export const subscriptionController = new Elysia({
  prefix: "/subscription",
}).post(
  "/",
  async ({ body }) => {
    console.log(body, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    const newSubscription = body;
    return await addSubscription(newSubscription);
  },
  {
    body: mailSubscriptionDTO,
  },
);
