import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'invite',
    description: 'Sends an embed with instructions on how to invite the bot',
    async execute(interaction, client) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(`Invite ${client.user.username} in your server`)
                .setColor(client.config.colors.main)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`[**Click me to invite the bot in your server**](https://discord.com/api/oauth2/authorize?client_id=${client.application.id}&permissions=8&scope=bot%20applications.commands)`)
                .setFooter(`Requested by ${interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }))
            ]
        });
    }
}