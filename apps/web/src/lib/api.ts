import type { AppType } from "@repo/api";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:3000");