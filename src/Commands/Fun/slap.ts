import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import { slap } from 'ainasepics';

export const command: Command = {
    name: 'slap',
    type: 'bot',
    category: 'Fun',
    aliases: [],
    description: `Slap a user of your choice`,
    run: async(client, args, message) => {
        const mentionedPerson = message.mentions.users.first();

        if(mentionedPerson) {
            message.channel.send({ embeds: [
                new MessageEmbed()
                    .setTitle(`${message.author.tag} slapped ${mentionedPerson.tag}`)
                    .setImage(slap())
                    .setColor('RANDOM')
                    .setTimestamp()
            ] });
        } else return message.reply('Mention a user you want to slap so hard.');
    }
}