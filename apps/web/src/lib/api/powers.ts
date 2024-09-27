import { client } from "@/lib/api";
import type { Power, PowerWithConfigurableFields } from "@repo/api";
import type { UploadPowerType } from "@repo/schemas";

export async function getPowers(): Promise<Power[]> {
    const response = await client.api.powers.$get();

    if (!response.ok) throw new Error("Failed to fetch powers.");

    return response.json();
}

export async function getPower(
    id: number
): Promise<PowerWithConfigurableFields> {
    const response = await client.api.powers[":id"].$get({
        param: {
            id: id.toString(),
        },
    });

    if (response.status !== 200) throw new Error("Failed to fetch powers.");

    return response.json();
}

export async function uploadPower(data: UploadPowerType) {
    const response = await client.api.powers.$post({
        json: data,
    });

    if (response.status !== 201) throw new Error("Failed to upload power.");

    return response.json();
}
