import { env } from "@/env";
import { loginAccount } from "@/lib/auth";
import { getGithubEmails, getGithubUser, github } from "@/lib/auth/github";
import { setSession } from "@/lib/auth/session";
import { generateState } from "arctic";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

const STATE_COOKIE = "github_oauth_state";

export const githubRoute = new Hono()
    .get("/", async (c) => {
        const state = generateState();

        const url = await github.createAuthorizationURL(state, {
            scopes: ["user:email"],
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

        const tokens = await github.validateAuthorizationCode(code);

        const profile = await getGithubUser(tokens.accessToken);

        if (!profile.email) {
            const emails = await getGithubEmails(tokens.accessToken);

            const primaryEmail = emails.find((email) => email.primary);

            if (!primaryEmail)
                return c.text(
                    "Your github account must have an email associated with it.",
                    400
                );

            profile.email = primaryEmail.email;
        }

        const user = await loginAccount(profile.id.toString(), "github", {
            avatarUrl: profile.avatar_url,
            email: profile.email,
            username: profile.login,
        });

        await setSession(c, user);

        return c.redirect("/");
    });
