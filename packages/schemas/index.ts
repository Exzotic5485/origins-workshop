import { getValueAtPath } from "@repo/utils";
import { z } from "zod";

export const powerSchema = z
    .object({
        type: z.string({ message: "Power must have a 'type' field" }).min(1),
        name: z.string().optional(),
        description: z.string().optional(),
        hidden: z.boolean().optional(),
    })
    .catchall(z.any());

export const configurableFieldSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    type: z.enum(["string", "number"]),
    fieldPath: z.string(),
});

export const uploadPowerFormSchema = z.object({
    name: z.string(),
    summary: z.string(),
    description: z.string(),
    data: z.string(),
    configurableFields: z.array(
        configurableFieldSchema.merge(z.object({ id: z.undefined() }))
    ),
});

export const uploadPowerSchema = uploadPowerFormSchema
    .merge(z.object({ data: powerSchema }))
    .superRefine((value, ctx) => {
        for (let i = 0; i < value.configurableFields.length; i++) {
            const configurableField = value.configurableFields[i];

            const fieldValue = getValueAtPath(
                value.data,
                configurableField.fieldPath
            );

            if (fieldValue === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `No value found at: ${configurableField.fieldPath}`,
                    path: ["configurableFields", i, "fieldPath"],
                });
            }
        }
    });

export type PowerType = z.infer<typeof powerSchema>;
export type ConfigurableFieldType = z.infer<typeof configurableFieldSchema>;

export type UploadPowerFormType = z.infer<typeof uploadPowerFormSchema>;
export type UploadPowerType = z.infer<typeof uploadPowerSchema>;
