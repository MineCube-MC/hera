import { GuildMember, Interaction, RoleResolvable } from 'discord.js';
import { Event } from '../Interfaces';
import { rolesSchema, rolesSchema as Schema } from '../Models/roles';

export const event: Event = {
    name: 'interactionCreate',
    run: async(client, interaction: Interaction) => {
        if(interaction.isButton()) {

			if(rolesSchema.findOne({ Role: interaction.customId }).clone()) {
				const role = interaction.guild.roles.cache.get(interaction.customId);

				await Schema.findOne({ Role: interaction.customId }, async(err, data) => {
					if(data) {
						if((data.Users as string[]).includes(interaction.user.id)) {
							const filtered = (data.Users as string[]).filter((target) => target !== interaction.user.id);
							await Schema.findOneAndUpdate({ Role: interaction.customId }, {
								Role: interaction.customId,
								Users: filtered
							}).clone();
							(interaction.member as GuildMember).roles.remove((interaction.customId as RoleResolvable));
							return interaction.reply({ content: `You've been removed the **${role.name}** role.`, ephemeral: true });
						}
	
						(data.Users as string[]).push(interaction.user.id);
						data.save();
						try {
							(interaction.member as GuildMember).roles.add((interaction.customId as RoleResolvable));
							interaction.reply({ content: `You got the **${role.name}** role.`, ephemeral: true });
						} catch (e) {
							if((data.Users as string[]).includes(interaction.user.id)) {
								const filtered = (data.Users as string[]).filter((target) => target !== interaction.user.id);
								await Schema.findOneAndUpdate({ Role: interaction.customId }, {
									Role: interaction.customId,
									Users: filtered
								}).clone();
								return interaction.reply({ content: `The bot hasn't enough permissions to add you the **${role.name}** role.`, ephemeral: true });
							}
						}
					} else {
						new Schema({
							Role: interaction.customId,
							Users: [ interaction.user.id ]
						}).save();
						try {
							(interaction.member as GuildMember).roles.add((interaction.customId as RoleResolvable));
							interaction.reply({ content: `You got the **${role.name}** role.`, ephemeral: true });
						} catch (e) {
							if((data.Users as string[]).includes(interaction.user.id)) {
								const filtered = (data.Users as string[]).filter((target) => target !== interaction.user.id);
								await Schema.findOneAndUpdate({ Role: interaction.customId }, {
									Role: interaction.customId,
									Users: filtered
								}).clone();
								return interaction.reply({ content: `The bot hasn't enough permissions to add you the **${role.name}** role.`, ephemeral: true });
							}
						}
					}
				}).clone();
			}
		}

		if(interaction.isCommand()) {
			if (!client.commands.has(interaction.commandName)) return;

			try {
				await client.commands.get(interaction.commandName).execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
    }
}