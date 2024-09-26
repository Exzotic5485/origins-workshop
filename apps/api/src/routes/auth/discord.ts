import { env } from "@/env";
import { loginAccount } from "@/lib/auth";
import { discord, getDiscordUser } from "@/lib/auth/discord";
import { setSession } from "@/lib/auth/session";
import { generateState } from "arctic";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

const STATE_COOKIE = "discord_oauth_state";

export const discordRoute = new Hono()
    .get("/", async (c) => {
        const state = generateState();

        const url = await discord.createAuthorizationURL(state, {
            scopes: ["identify", "email"],
        });

        setCookie(c, STATE_COOKIE, state, {
            path: "/",
            secure: env.PRODUCTION,
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 600,
        });

        return c.redirect(url.href);
    })
    .get("/callback", async (c) => {
        const { code, state } = c.req.query();

        const stateCookie = getCookie(c, STATE_COOKIE);

        if (!stateCookie || state !== stateCookie)
            return c.text("Bad Request. State did not match.", 400);

        const tokens = await discord.validateAuthorizationCode(code);

        const profile = await getDiscordUser(tokens.accessToken);

        if (!profile.email)
            return c.text(
                "Your discord account must have an email associated with it.",
                400
            );

        const user = await loginAccount(profile.id, "discord", {
            username: profile.username,
            email: profile.email,
            avatarUrl: "#",
        });

        await setSession(c, user);

        return c.redirect("/");
    });
