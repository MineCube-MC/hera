import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import { slap } from 'ainasepics';

export const command: Command = {
    name: 'slap',
    options: [
        {
            name: 'user',
            description: 'The user you want to slap',
            type: 'USER',
            required: true
        }
    ],
    description: `Hug a user of your choice`,
    async execute(interaction, client) {
        const mentionedPerson = interaction.options.getUser("user");

        interaction.reply({ embeds: [
            new MessageEmbed()
                .setTitle(`${interaction.user.tag} slapped ${mentionedPerson.tag}`)
                .setImage(slap())
                .setColor(client.config.colors.fun)
                .setTimestamp()
        ] });
    }
}