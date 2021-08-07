import {  MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'howgay',
    description: `Check your/others' gayness`,
    options: [
        {
            name: 'user',
            description: 'The user you want to check the gayness',
            type: 'USER',
            required: false
        }
    ],
    async execute(interaction, client) {
        const mentionedPerson = interaction.options.getUser("user")?.id;

        function gayPercentage() {
            let min = Math.ceil(0);
            let max = Math.floor(100);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const gayEmbed = new MessageEmbed()
            .setColor(client.config.colors.fun)
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }));
        
        if(mentionedPerson) return interaction.reply({ embeds: [ gayEmbed.setDescription(`:rainbow_flag: <@${mentionedPerson}> is ${gayPercentage()}% gay.`) ] });

        if(!mentionedPerson) return interaction.reply({ embeds: [ gayEmbed.setDescription(`:rainbow_flag: You are ${gayPercentage()}% gay.`) ] });
    }
}