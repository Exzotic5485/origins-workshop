import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export function getUserByEmail(email: string) {
    return db.query.users.findFirst({
        where: eq(users.email, email),
    });
}

export async function createUser(email: string) {
    const [ user ] = await db.insert(users).values({ email }).returning();

    return user;
}
