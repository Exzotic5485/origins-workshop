import { eq } from "drizzle-orm";
import { db } from "../db";
import { powers } from "../db/schema";

export function getPowerById(id: number) {
    return db.query.powers.findFirst({
        where: eq(powers.id, id),
    });
}

export function getPowers() {
    return db.select().from(powers);
}