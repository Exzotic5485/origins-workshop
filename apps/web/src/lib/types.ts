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

export type PowerType = {
    type: string;
    name?: string;
    description?: string;
    hidden?: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: powers can be off too many types
} & Record<string, any>;
