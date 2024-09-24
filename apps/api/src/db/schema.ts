import { relations } from "drizzle-orm";
import { jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    
});

export const powers = pgTable("powers", {
    id: serial("id").primaryKey(),
    data: jsonb("data").notNull().$type(),
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
});

export const powersRelations = relations(powers, ({ many }) => ({
    configurableFields: many(configurableFields),
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

export type Power = typeof powers.$inferSelect;
export type ConfigurableField = typeof configurableFields.$inferSelect;

export type PowerWithConfigurableFields = Power & {
    configurableFields: ConfigurableField[];
};
