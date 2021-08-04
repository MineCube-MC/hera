import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'ban',
    type: 'bot',
    category: 'Moderation',
    aliases: ['banhammer'],
    description: 'Bans a user from the guild.',
    usage: '<@user> [reason]',
    run: async(client, args, message) => {
        if(!message.member.permissions.has('BAN_MEMBERS')) return message.reply(`You don't have enough permissions to use this command`);
        if(!args[0]) return message.reply('You must mention a user to use the ban hammer on.');

        let punishedUser = message.mentions.members.first();
        const banReason = args.slice(1).join(' ');

        if(!punishedUser) {
            try {
                if (!message.guild.members.cache.get(args.slice(0, 1).join(' '))) return message.reply('Couldn\'t get a Discord user with this userID!');
			    punishedUser = message.guild.members.cache.get(args.slice(0, 1).join(' '));
            } catch (err) {
                return message.reply('Couldn\'t get a Discord user with this userID!');
            }
        }

        if(punishedUser.user === message.author) return message.reply(`I don't think you can use the ban hammer on yourself.`);

        if(!punishedUser.kickable) return message.reply("Can't ban this user, does he have a higher role? Is the server creator? Have I got the permission to ban him?");

        message.guild.members.ban(punishedUser, { reason: banReason });

        const banEmbed = new MessageEmbed()
            .setColor(client.config.colors.positive)
            .setDescription(`✅ **${punishedUser.user.tag}** has been successfully banned!\nReason: __${banReason}__`);
        
        if(!banReason) banEmbed.setDescription(`✅ **${punishedUser.user.tag}** has been successfully banned!\nReason: __Not specified__`);

        message.reply({ embeds: [ banEmbed ] });
    }
}