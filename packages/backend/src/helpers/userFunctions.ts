import { NewUser, users } from "@server/db/schema";
import { db } from "@server/db/db";

export async function getAllUsers() {
  return await db.select().from(users);
}

export async function addUser(user: NewUser): Promise<boolean> {
  const result = (await db.insert(users).values(user).returning())[0];
  if (result) {
    return true;
  } else {
    return false;
  }
}
