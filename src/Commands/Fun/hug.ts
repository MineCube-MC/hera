import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import { hug } from 'ainasepics';

export const command: Command = {
    name: 'hug',
    type: 'bot',
    category: 'Fun',
    aliases: [],
    description: `Hug a user of your choice`,
    run: async(client, args, message) => {
        const mentionedPerson = message.mentions.users.first();

        if(mentionedPerson) {
            message.channel.send({ embeds: [
                new MessageEmbed()
                    .setTitle(`${message.author.tag} hugged ${mentionedPerson.tag}`)
                    .setImage(hug())
                    .setColor(client.config.colors.fun)
                    .setTimestamp()
            ] });
        } else return message.reply('Mention a user you want to hug.');
    }
}