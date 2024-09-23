import { client } from "@/lib/api";

export async function getPowers() {
    const response = await client.api.powers.$get();

    if (!response.ok) throw new Error("Failed to fetch powers.");

    return response.json();
}

export async function getPower(id: number) {
    const response = await client.api.powers[":id"].$get({
        param: {
            id: id.toString(),
        },
    });

    if (response.status !== 200) throw new Error("Failed to fetch powers.");

    const { power } = await response.json();

    return power;
}
