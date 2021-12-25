import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import ainasepics from 'ainasepics';

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

        let hug = await ainasepics.get('hug');

        interaction.reply({ embeds: [
            new MessageEmbed()
                .setTitle(`${interaction.user.tag} hugged ${mentionedPerson.tag}`)
                .setImage(hug.url)
                .setColor(client.config.colors.fun)
                .setTimestamp()
        ] });
    }
}