import { logoutSession, validateSession } from "@/lib/auth/session";
import { discordRoute } from "@/routes/auth/discord";
import { githubRoute } from "@/routes/auth/github";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const authRoute = new Hono()
    .route("/github", githubRoute)
    .route("/discord", discordRoute)
    .get("/me", async (c) => {
        const user = await validateSession(c);

        if (!user) throw new HTTPException(401);

        return c.json({
            id: user.sub as number, // for hono rpc to work have to do this 'as'
            email: user.email as string,
            username: user.username as string,
        });
    })
    .get("/logout", async (c) => {
        logoutSession(c);

        return c.redirect("/");
    });
