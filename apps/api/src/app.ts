import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { powersRoute } from "./routes/powers";

const app = new Hono();

app.use(logger());
app.use(
    cors({
        origin: ["http://localhost:5173"],
    })
);

const apiRoutes = app.basePath("/api").route("/powers", powersRoute);

export default app;
export type AppType = typeof apiRoutes;
