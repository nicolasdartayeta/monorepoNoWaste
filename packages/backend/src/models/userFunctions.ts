import { NewUser, User, users } from "@server/db/schema";
import { db } from "@server/db/db";
import { eq } from "drizzle-orm";

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

export async function getUserByEmail(email: string): Promise<User> {
  return (await db.select().from(users).where(eq(users.email, email)))[0];
}
