import { client, db } from ".";
import { powers } from "./schema";

async function main() {
    await db.insert(powers).values({
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
    });

    await client.end();
}

main();
