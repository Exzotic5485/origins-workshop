import { eq } from "drizzle-orm";
import { db } from "../db";
import { powers } from "../db/schema";

export function getPowerById(id: number) {
    return db.query.powers.findFirst({
        where: eq(powers.id, id),
        with: {
            configurableFields: true
        }
    });
}

export function getPowers() {
    return db.query.powers.findMany({
        columns: {
            id: true,
            name: true,
            summary: true
        }
    })
}