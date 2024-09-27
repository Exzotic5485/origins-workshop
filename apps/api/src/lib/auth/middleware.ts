import { validateSession, type JWTPayload } from "@/lib/auth/session";
import { createMiddleware } from "hono/factory";

type Env = {
    Variables: {
        user: JWTPayload;
    };
};

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
    const user = await validateSession(c);

    if (!user) return c.json({ error: "Unauthorized." }, 401);

    c.set("user", user);

    await next();
});
