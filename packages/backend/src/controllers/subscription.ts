import Elysia, { t } from "elysia";
import {
  addSubscription,
  deleteSubscription,
  sendMailToAllSubscriptions,
} from "../models/subscriptionFunctions";
import { mailSubscriptionDTO } from "../types";
export const subscriptionController = new Elysia({
  prefix: "/subscription",
})
  .post(
    "/",
    async ({ body }) => {
      const newSubscription = body;
      return await addSubscription(newSubscription);
    },
    {
      body: mailSubscriptionDTO,
    },
  )
  .delete(
    "/unsubscribe",
    async ({ body }) => {
      const Subscription = body;
      return await deleteSubscription(Subscription);
    },
    {
      body: mailSubscriptionDTO,
    },
  )
  .post(
    "/sendMail",
    async ({ body }) => {
      const { mail_data, subject } = body;
      await sendMailToAllSubscriptions(mail_data, subject);
    },
    {
      body: t.Object({
        mail_data: t.String(),
        subject: t.String(),
      }),
    },
  );
