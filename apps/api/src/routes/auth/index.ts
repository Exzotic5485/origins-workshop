import { githubRoute } from "@/routes/auth/github";
import { Hono } from "hono";

export const authRoute = new Hono().route("/github", githubRoute);
