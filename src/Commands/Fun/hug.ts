import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import { hug } from 'ainasepics';

export const command: Command = {
    name: 'hug',
    options: [
        {
            name: 'user',
            description: 'The user you want to hug',
            type: 'USER',
            required: true
        }
    ],
    description: `Hug a user of your choice`,
    async execute(interaction, client) {
        const mentionedPerson = interaction.options.getUser("user");

        if(mentionedPerson) {
            interaction.reply({ embeds: [
                new MessageEmbed()
                    .setTitle(`${interaction.user.tag} hugged ${mentionedPerson.tag}`)
                    .setImage(hug())
                    .setColor(client.config.colors.fun)
                    .setTimestamp()
            ] });
        } else return interaction.reply('Mention a user you want to hug.');
    }
}