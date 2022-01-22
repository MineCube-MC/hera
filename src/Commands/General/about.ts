import { MessageEmbed } from 'discord.js';
import { Configuration } from '../../Dashboard/Modules/Configuration';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'about',
    description: 'Sends more information about the bot',
    async execute(interaction, client) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor(client.config.colors.main)
                .setTitle(`What is Plenus?`)
                .setDescription(`Plenus is a Discord bot made in **discord.js**, a powerful Node.js library to interact with the Discord API.`)
                .addField('Features', `The bot has the following features:
                - **Slash commands**, the newest Discord commands implementation
                - **Moderation commands**, that makes moderation for everyone easier than it was before
                - **Fun commands**, helpful for the chat to not die and to express yourself with the funniest commands
                - **Giveaway commands**, helpful to start a giveaway and manage it easily
                - **Activity commands**, such as YouTube Together and Doodle Crew to entertain yourself and your friends in a voice chat
                - **Administration commands**, which help with things like logging, words blacklist and so much more...
                - A **Dashboard**, that helps you to change some of the guild settings with Plenus easily`)
                .addField('Links', `
                [Support Server](https://discord.gg/CNTz9fDYYJ) | [Bot Invite](https://discord.com/api/oauth2/authorize?client_id=${client.application.id}&permissions=8&scope=bot%20applications.commands) | [GitHub Repository](https://github.com/ApexieCommunity/Plenus)
                `)
                .addField('Community', Configuration.botStatistics(client, false))
                .setFooter(`Created by the Plenus Team`, 'https://i.imgur.com/PXKhUSB.png')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            ]
        });
    }
}