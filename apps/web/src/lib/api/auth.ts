import { client } from "@/lib/api";

export async function getUser() {
    const response = await client.api.auth.me.$get();

    switch (response.status) {
        case 200:
            return response.json();
        case 401:
            return;
        default:
            throw new Error("Failed to fetch current user.");
    }
}