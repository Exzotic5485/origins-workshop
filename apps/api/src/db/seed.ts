import { client, db } from ".";
import {
    type PowerWithConfigurableFields,
    configurableFields,
    powers,
} from "./schema";

const POWERS: PowerWithConfigurableFields[] = [
    {
        id: 0,
        name: "Test Power",
        description: "A description of the test power.",
        summary: "A short summary...",
        data: {
            type: "origins:active_self",
            entity_action: {
                type: "origins:execute_command",
                command:
                    'tellraw @a {"text": "Hello world!", "color": "green"}',
            },
            name: "Hello World!",
            description:
                "A power that announces a 'Hello world!' message to everyone in the server.",
            badges: [
                {
                    sprite: "minecraft:textures/item/diamond.png",
                    text: "Ooh, shiny!",
                },
            ],
        },
        configurableFields: [
            {
                powerId: 0,
                id: 0,
                name: "Command",
                description:
                    "Modify the command that is ran when you press primary key.",
                fieldPath: "entity_action.command",
            },
        ],
    },
];

async function main() {
    for (const power of POWERS) {
        const savedPower = await db
            .insert(powers)
            .values({
                ...power,
                id: undefined,
            })
            .returning();

        for (const configurableField of power.configurableFields) {
            await db.insert(configurableFields).values({
                ...configurableField,
                powerId: savedPower[0].id,
                id: undefined,
            });
        }
    }

    await client.end();
}

main();
