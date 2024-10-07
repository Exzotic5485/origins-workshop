import type { PowerType } from "@repo/schemas";
import { relations } from "drizzle-orm";
import { jsonb, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

// Enums:

export const accountProviderEnum = pgEnum("provider", ["github", "discord"]);

export const configurableFieldTypeEnum = pgEnum("configurable_field_type", [
    "string",
    "number",
]);

// Tables:

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").unique().notNull(),
    username: text("username").unique().notNull(),
});

export const accounts = pgTable("accounts", {
    id: serial("id").primaryKey(),
    userId: serial("user_id").references(() => users.id, {
        onDelete: "cascade",
    }),
    provider: accountProviderEnum("provider").notNull(),
    providerId: text("provider_id").unique(),
});

export const powers = pgTable("powers", {
    id: serial("id").primaryKey(),
    userId: serial("user_id").references(() => users.id, {
        onDelete: "cascade",
    }),
    data: jsonb("data").notNull().$type<PowerType>(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    summary: text("summary").notNull(),
});

export const configurableFields = pgTable("configureable_fields", {
    id: serial("id").primaryKey(),
    powerId: serial("power_id")
        .notNull()
        .references(() => powers.id, { onDelete: "cascade" }),
    fieldPath: text("field_path").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    type: configurableFieldTypeEnum("type").notNull(),
});

// Relations:

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    powers: many(powers),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const powersRelations = relations(powers, ({ many, one }) => ({
    configurableFields: many(configurableFields),
    user: one(users, {
        fields: [powers.userId],
        references: [users.id],
    }),
}));

export const configurableFieldsRelations = relations(
    configurableFields,
    ({ one }) => ({
        powers: one(powers, {
            fields: [configurableFields.powerId],
            references: [powers.id],
        }),
    })
);

// Types:

export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferInsert;

export type Power = typeof powers.$inferSelect;
export type NewPower = typeof powers.$inferInsert;

export type ConfigurableField = typeof configurableFields.$inferSelect;

export type AccountType = (typeof accountProviderEnum.enumValues)[number];

export type PowerWithConfigurableFields = Power & {
    configurableFields: ConfigurableField[];
};
