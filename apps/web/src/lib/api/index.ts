import { hc } from "hono/client";
import type { AppType } from "@repo/api";

export const client = hc<AppType>("/");