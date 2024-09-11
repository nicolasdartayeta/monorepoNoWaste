import { users } from "@server/db/schema";
import { db } from "@server/db/db";
// import { userInsertDTO } from "@server/src/types";

export async function getAllUsers() {
  return await db.select().from(users);
}

// export async function addUser(user: typeof userInsertDTO): Promise<boolean> {}
