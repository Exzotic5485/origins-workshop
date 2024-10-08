import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createPower, getPowerById, getPowers } from "@/data-access/power";
import { authMiddleware } from "@/lib/auth/middleware";
import { zValidator } from "@hono/zod-validator";
import { uploadPowerSchema } from "@repo/schemas";

export const powersRoute = new Hono()
    .get("/", async (c) => {
        const search = c.req.query("search");
        const page = c.req.query("page");

        const powers = await getPowers();

        return c.json(powers);
    })
    .get("/:id", async (c) => {
        const id = Number(c.req.param("id"));

        if (Number.isNaN(id))
            throw new HTTPException(400, {
                message: "Invalid ID provided. ID must be a number!",
            });

        const power = await getPowerById(Number(id));

        if (!power) return c.json({ message: "Not found." }, 404);

        return c.json(power);
    })
    .post(
        "/",
        authMiddleware,
        zValidator("json", uploadPowerSchema),
        async (c) => {
            const user = c.get("user");

            const body = c.req.valid("json");

            const power = await createPower({
                ...body,
                userId: user.sub,
            });

            return c.json(power, 201);
        }
    );
