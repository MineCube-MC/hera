import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'kick',
    type: 'bot',
    category: 'Moderation',
    
    description: 'Kicks a user from the guild.',
    usage: '<@user>',
    run: async(client, args, interaction) => {
        if(!interaction.member.permissions.has('KICK_MEMBERS')) return interaction.reply(`You don't have enough permissions to use this command`);
        if(!args[0]) return interaction.reply('You must mention a user to kick.');

        let punishedUser = interaction.mentions.members.first();

        if(!punishedUser.kickable) return interaction.reply("I haven't the permission to kick this user. Does he have a higher role? Have I got the permission to kick him?");

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