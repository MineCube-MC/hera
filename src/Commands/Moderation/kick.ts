import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'kick',
    type: 'bot',
    category: 'Moderation',
    aliases: [],
    description: 'Kicks a user from the guild.',
    usage: '<@user>',
    run: async(client, args, message) => {
        if(!message.member.permissions.has('KICK_MEMBERS')) return message.reply(`You don't have enough permissions to use this command`);
        if(!args[0]) return message.reply('You must mention a user to kick.');

        let punishedUser = message.mentions.members.first();

        if(!punishedUser.kickable) return message.reply("I haven't the permission to kick this user. Does he have a higher role? Have I got the permission to kick him?");

	    try {
		    punishedUser.kick();

            message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('#0099ff')
                    .setDescription(`✅ **${punishedUser.user.tag}** has been successfully kicked!`)
                ]
            });
	    } catch (error) {
		    message.reply("Can't kick this user, does he have a higher role? Is the server creator? Have I got the permission to kick him?");
	    }
    }
}