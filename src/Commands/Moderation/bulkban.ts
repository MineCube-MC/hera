import { ColorResolvable, MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'bulkban',
    type: 'bot',
    category: 'Moderation',
    aliases: [],
    description: 'Bans multiple people at once',
    run: async(client, args, message) => {
        if(!message.member.permissions.has('BAN_MEMBERS')) return message.reply(`You don't have enough permissions to use this command`);
        if(!args[0]) return message.reply('You must mention at least a user to use the ban hammer on.');

        const punishedUsers = message.mentions.members;

        punishedUsers.forEach(user => {
            user.ban();
        });

        message.channel.send({ embeds: [
            new MessageEmbed()
                .setDescription(`✅ **${punishedUsers.size} users** have been banned from the server.`)
                .setColor((client.config.colors.main as ColorResolvable))
        ] });
    }
}