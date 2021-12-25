import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import ainasepics from 'ainasepics';

export const command: Command = {
    name: 'kiss',
    options: [
        {
            name: 'user',
            description: 'The user you want to kiss',
            type: 'USER',
            required: true
        }
    ],
    description: `Kiss a user of your choice`,
    async execute(interaction, client) {
        const mentionedPerson = interaction.options.getUser("user");

        const kiss = await ainasepics.get('kiss');

        if(mentionedPerson) {
            interaction.reply({ embeds: [
                new MessageEmbed()
                    .setTitle(`${interaction.user.tag} kissed ${mentionedPerson.tag}`)
                    .setImage(kiss.url)
                    .setColor(client.config.colors.fun)
                    .setTimestamp()
            ] });
        } else return interaction.reply('Mention a user you want to kiss.');
    }
}