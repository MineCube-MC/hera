import { Interaction } from 'discord.js';
import { Event } from '../Interfaces';

export const event: Event = {
    name: 'interactionCreate',
    run: async(client, interaction: Interaction) => {
        if (interaction.isCommand()) {
			await interaction.deferReply({ ephemeral: false }).catch(() => {});
	
			const cmd = client.commands.get(interaction.commandName);
			if (!cmd)
				return interaction.followUp({ content: "An error has occured" });
	
			const args = [];
	
			for (let option of interaction.options.data) {
				if (option.type === "SUB_COMMAND") {
					if (option.name) args.push(option.name);
					option.options?.forEach((x) => {
						if (x.value) args.push(x.value);
					});
				} else if (option.value) args.push(option.value);
			}
	
			cmd.run(client, args, interaction);
		}
    }
}