import { db } from "@/db";
import { type NewPower, powers } from "@/db/schema";
import { eq } from "drizzle-orm";

export function getPowerById(id: number) {
    return db.query.powers.findFirst({
        where: eq(powers.id, id),
        with: {
            configurableFields: true,
        },
    });
}

export function getPowers() {
    return db.query.powers.findMany({
        columns: {
            id: true,
            name: true,
            summary: true,
        },
    });
}

export async function createPower(newPower: NewPower) {
    const [power] = await db.insert(powers).values(newPower).returning();

    return power;
}
