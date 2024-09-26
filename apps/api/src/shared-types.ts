export type { AppType } from "./app";
export type { Power, ConfigurableField, PowerWithConfigurableFields } from "./db/schema";

export type PowerType = {
    type: string;
    name?: string;
    description?: string;
    hidden?: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: powers can be off too many types
    [key: string]: any;
}
