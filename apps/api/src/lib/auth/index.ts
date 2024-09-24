import { createAccount, getAccountByProvider } from "@/data-access/account";
import { createUser, getUserByEmail } from "@/data-access/user";
import type { Account, AccountType } from "@/db/schema";
import { env } from "@/env";
import { sign } from "hono/jwt";

type ProviderData = {
    email: string;
    username: string;
    avatarUrl: string;
};

export async function loginAccount(
    id: string,
    provider: AccountType,
    providerData: ProviderData
) {
    let account = await getAccountByProvider(id, provider);

    if (!account) {
        let user = await getUserByEmail(providerData.email);

        if (!user) {
            user = await createUser(providerData.email);
        }

        account = await createAccount(user.id, id, provider);
    }

    return account;
}

// TODO: access & refresh tokens
export async function createTokens(account: Account) {
    const token = await sign(
        {
            sub: account.userId,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
        },
        env.JWT_SECRET
    );

    return { token };
}
