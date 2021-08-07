import { Interaction } from 'discord.js';
import { Event } from '../Interfaces';

export const event: Event = {
    name: 'interactionCreate',
    run: async(client, interaction: Interaction) => {
        if (!interaction.isCommand()) return;

		if (!client.commands.has(interaction.commandName)) return;

		try {
			await client.commands.get(interaction.commandName).execute(client, interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    }
}