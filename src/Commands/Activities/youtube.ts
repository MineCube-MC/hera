import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'youtube',
    category: 'Activities',
    aliases: [],
    description: 'Allows you to watch YouTube in the current voice chat.',
    run: async(client, message, args) => {
        if(message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channelID, 'youtube').then(async invite => {
                message.channel.send(
                    new MessageEmbed()
                        .setAuthor('YouTube Together')
                        .setColor(client.config.colors.main)
                        .setDescription('This feature allows you to watch YouTube along with other people in a voice chat. Click the link down below to start the fun.')
                        .addField('Invite link', invite.code)
                );
            });
        } else {
            message.reply(`You need to be in a voice chat for this to work.`);
        }
    }
}