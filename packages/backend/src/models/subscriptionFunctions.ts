import { db } from "@server/db/db";
import { mailSubscription, NewMailSubscription } from "../../db/schema";

export async function addSubscription(mail: NewMailSubscription) {
  console.log(mail, "awdnjkoawdniojuawdoun");
  const result = await db.insert(mailSubscription).values(mail).returning();
  if (result) return true;
  return false;
}
