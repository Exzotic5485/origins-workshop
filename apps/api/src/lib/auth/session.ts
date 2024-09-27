import type { User } from "@/db/schema";
import { env } from "@/env";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export const JWT_LIFE_SPAN = 60 * 60 * 24; // 24 hours

export type JWTPayload = {
    sub: number;
    email: string;
    username: string;
    exp: number;
    iat: number;
};

export async function setSession(c: Context, user: User) {
    const { token } = await createTokens(user);

    setCookie(c, ACCESS_TOKEN_COOKIE, token, {
        path: "/",
        secure: env.PRODUCTION,
        httpOnly: true,
        sameSite: "Strict",
        maxAge: JWT_LIFE_SPAN,
    });
}

export async function validateSession(c: Context): Promise<JWTPayload | null> {
    const accessToken = getCookie(c, ACCESS_TOKEN_COOKIE);

    if (!accessToken) return null;

    try {
        return verify(accessToken, env.JWT_SECRET) as Promise<JWTPayload>;
    } catch (e) {
        return null;
    }
}

export async function logoutSession(c: Context) {
    setCookie(c, ACCESS_TOKEN_COOKIE, "", {
        maxAge: 0,
    });

    // invalidate refresh token...
}

// TODO: refresh tokens
async function createTokens(user: User) {
    const token = await sign(
        {
            sub: user.id,
            email: user.email,
            username: user.username,
            exp: Math.floor(Date.now() / 1000) + JWT_LIFE_SPAN,
            iat: Math.floor(Date.now() / 1000),
        } satisfies JWTPayload,
        env.JWT_SECRET
    );

    return { token };
}
