import {
  NewUser,
  NewUserIdentity,
  User,
  user,
  UserIdentity,
  userIdentity,
} from "@server/db/schema";
import { db } from "@server/db/db";
import { and, eq } from "drizzle-orm";

export async function getAllUsers() {
  return await db.select().from(user);
}

export async function addUser(newUser: NewUser): Promise<User> {
  return (await db.insert(user).values(newUser).returning())[0];
}

export async function addUserIdentity(
  newUserIdentity: NewUserIdentity,
): Promise<UserIdentity> {
  return (await db.insert(userIdentity).values(newUserIdentity).returning())[0];
}

export async function getUserByEmail(email: string): Promise<User> {
  return (await db.select().from(user).where(eq(user.email, email)))[0];
}

export async function getUserByIdentityProvider(
  provider_id: string,
  provider: string,
): Promise<User | null> {
  const result = await db
    .select()
    .from(user)
    .fullJoin(userIdentity, eq(user.id, userIdentity.user_id))
    .where(
      and(
        eq(userIdentity.provider, provider),
        eq(userIdentity.provider_id, provider_id),
      ),
    );

  if (!result || result.length === 0) {
    return null;
  }
  return result[0].users;
}
