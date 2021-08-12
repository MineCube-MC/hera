import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'kick',
    options: [
        {
            name: 'member',
            description: 'The member that needs to be kicked',
            type: 'USER',
            required: true
        }
    ],
    description: 'Kicks a member from the guild.',
    async execute(interaction, client) {
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('KICK_MEMBERS')) return interaction.reply({ content: `You don't have enough permissions to use this command.`, ephemeral: true });

        let punishedUser = interaction.guild.members.cache.get(interaction.options.getUser("member").id);

        if(!punishedUser.kickable) return interaction.reply("I haven't the permission to kick this user. Does he have a higher role? Do I have the permission to kick him?");

	    try {
		    punishedUser.kick();

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(client.config.colors.positive)
                    .setDescription(`✅ **${punishedUser.user.tag}** has been successfully kicked!`)
                ]
            });
	    } catch (error) {
		    interaction.reply("Can't kick this user, does he have a higher role? Is the server creator? Have I got the permission to kick him?");
	    }
    }
}