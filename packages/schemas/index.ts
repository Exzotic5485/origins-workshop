import { z } from "zod";

export const powerSchema = z
    .object({
        type: z.string({ message: "Power must have a 'type' field" }).min(1),
        name: z.string().optional(),
        description: z.string().optional(),
        hidden: z.boolean().optional(),
    })
    .catchall(z.any());

export const uploadPowerSchema = z.object({
    name: z.string(),
    summary: z.string(),
    description: z.string(),
    data: powerSchema,
});

export type PowerType = z.infer<typeof powerSchema>;

export type UploadPowerType = z.infer<typeof uploadPowerSchema>;
