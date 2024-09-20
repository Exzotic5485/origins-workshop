import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        // biome-ignore lint/style/noNonNullAssertion:
        url: process.env.DATABASE_URL!
    }
});
