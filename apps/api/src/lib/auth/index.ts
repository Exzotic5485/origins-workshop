import { createAccount, getAccountByProvider } from "@/data-access/account";
import { createUser, getUserByEmail, getUserById } from "@/data-access/user";
import type { AccountType } from "@/db/schema";

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

    let user = account
        ? await getUserById(account.userId)
        : await getUserByEmail(providerData.email);

    if (!account) {
        if (!user) {
            user = await createUser(providerData.email, providerData.username);
        }

        account = await createAccount(user.id, id, provider);
    }

    if (!user)
        throw new Error("User has an account but no user associated with it."); // this should never happen.

    return user;
}
