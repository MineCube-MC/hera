import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'kick',
    category: 'Moderation',
    aliases: [],
    description: 'Kicks a user from the guild.',
    usage: '<@user>',
    run: async(client, message, args) => {
        if(message.channel.type === 'dm') return message.reply('This command is only available in servers.');
        if(!message.member.permissions.has('KICK_MEMBERS')) return message.reply(`You don't have enough permissions to use this command`);
        if(!args[0]) return message.reply('You must mention a user to kick.');

        let punishedUser = message.mentions.members.first();

        if(!punishedUser.kickable) return message.reply("I haven't the permission to kick this user. Does he have a higher role? Have I got the permission to kick him?");

	    try {
            try {
                punishedUser.send(
                    new MessageEmbed()
                        .setColor('#0099ff')
                        .setAuthor(message.guild.name)
                        .setDescription(`You got kicked from **${message.guild.name}**!`)
                );
            } catch (e) {}

		    punishedUser.kick();

            message.reply(
                new MessageEmbed()
                    .setColor('#0099ff')
                    .setDescription(`✅ **${punishedUser.user.tag}** has been successfully kicked!`)
            );
	    } catch (error) {
		    message.reply("Can't kick this user, does he have a higher role? Is the server creator? Have I got the permission to kick him?");
	    }
    }
}