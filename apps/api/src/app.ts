import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { powersRoute } from "./routes/powers";
import { authRoute } from "./routes/auth";
import { trimTrailingSlash } from "hono/trailing-slash";

const app = new Hono();

app.use(logger());
app.use(
    cors({
        origin: ["http://localhost:5173"],
    })
);
app.use(trimTrailingSlash());

const apiRoutes = app
    .basePath("/api")
    .route("/powers", powersRoute)
    .route("/auth", authRoute);

export default app;
export type AppType = typeof apiRoutes;
