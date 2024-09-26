import { client } from "@/lib/api";
import type { Power } from "@repo/api";

export async function getPowers(): Promise<Power[]> {
    const response = await client.api.powers.$get();

    if (!response.ok) throw new Error("Failed to fetch powers.");

    return response.json();
}

export async function getPower(id: number): Promise<Power> {
    const response = await client.api.powers[":id"].$get({
        param: {
            id: id.toString(),
        },
    });

    if (response.status !== 200) throw new Error("Failed to fetch powers.");

    return response.json();
}
