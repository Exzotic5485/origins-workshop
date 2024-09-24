import { db } from "@/db";
import { accounts, type AccountType } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export function getAccountByProvider(id: string, provider: AccountType) {
    return db.query.accounts.findFirst({
        where: and(
            eq(accounts.providerId, id),
            eq(accounts.provider, provider)
        ),
    });
}

export async function createAccount(
    userId: number,
    providerId: string,
    provider: AccountType
) {
    const [account] = await db.insert(accounts).values({
        userId,
        provider,
        providerId,
    });

    return account;
}
