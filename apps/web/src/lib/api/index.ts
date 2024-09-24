import type { AppType } from "@repo/api";
import { hc } from "hono/client";

export const client = hc<AppType>("/");
