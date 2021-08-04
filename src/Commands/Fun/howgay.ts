import {  MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'howgay',
    type: 'bot',
    category: 'Fun',
    aliases: [],
    description: `Check your/others' gayness`,
    run: async(client, args, message) => {
        const mentionedPerson = message.mentions.users.first()?.id;

        function gayPercentage() {
            let min = Math.ceil(0);
            let max = Math.floor(100);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const gayEmbed = new MessageEmbed()
            .setColor(client.config.colors.fun)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
        
        if(mentionedPerson) return message.channel.send({ embeds: [ gayEmbed.setDescription(`:rainbow_flag: <@${mentionedPerson}> is ${gayPercentage()}% gay.`) ] });

        if(!mentionedPerson) return message.reply({ embeds: [ gayEmbed.setDescription(`:rainbow_flag: You are ${gayPercentage()}% gay.`) ] });
    }
}