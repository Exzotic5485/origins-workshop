import { env } from "@/env";
import { Discord } from "arctic";

type DiscordUser = {
    id: string;
    username: string;
    avatar?: string;
    email?: string;
}

export const discord = new Discord(
    env.DISCORD_CLIENT_ID,
    env.DISCORD_CLIENT_SECRET,
    env.DISCORD_REDIRECT_URL
);

export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
    const response = await fetch("https://discord.com/api/users/@me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status !== 200) throw new Error("Failed to get discord user.");

    return response.json();
}
