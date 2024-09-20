import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getMinecraftAssetImage(id: string) {
    if(!id) return getMinecraftAssetImage("minecraft:air");

    let [namespace, path] = id.split(":");

    if (!path) {
        path = namespace;
        namespace = "minecraft";
    }

    return `https://mc-items-cdn.exzotic.xyz/${namespace}/${path}.png`;
}
