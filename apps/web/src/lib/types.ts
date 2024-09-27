import type { PowerType } from "@repo/schemas";
import type { PowerWithConfigurableFields } from "../../../api/src/db/schema";

export type OriginType = {
    name: string;
    icon: string;
    impact: number;
    unchoosable: boolean;
    description: string;
};

export type StoredOriginType = {
    id: number;
    powers: StoredPowerType[];
} & OriginType;

export type StoredPowerType = {
    id: number;
    remote: Omit<PowerWithConfigurableFields, "data">;
    data: PowerType;
};
