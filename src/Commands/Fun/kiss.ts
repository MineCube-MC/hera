import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import { kiss } from 'ainasepics';

export const command: Command = {
    name: 'kiss',
    type: 'bot',
    category: 'Fun',
    aliases: [],
    description: `Kiss a user of your choice`,
    run: async(client, args, message) => {
        const mentionedPerson = message.mentions.users.first();

        if(mentionedPerson) {
            message.channel.send({ embeds: [
                new MessageEmbed()
                    .setTitle(`${message.author.tag} kissed ${mentionedPerson.tag}`)
                    .setImage(kiss())
                    .setColor(client.config.colors.fun)
                    .setTimestamp()
            ] });
        } else return message.reply('Mention a user you want to kiss.');
    }
}