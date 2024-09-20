import { Hono } from "hono";
import { logger } from "hono/logger";
import { powersRoute } from "./routes/powers";

const app = new Hono();

app.use(logger());

const apiRoutes = app.basePath("/api").route("/powers", powersRoute);

export default app;
export type AppType = typeof apiRoutes;
