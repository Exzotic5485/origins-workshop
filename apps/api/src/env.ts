import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),
    DISCORD_REDIRECT_URL: z.string().min(1),
    JWT_SECRET: z.string().min(16),
});

export const env = {
    ...envSchema.parse(process.env),
    PRODUCTION: process.env.NODE_ENV === "production",
};
