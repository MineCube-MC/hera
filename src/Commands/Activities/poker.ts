import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'poker',
    category: 'Activities',
    aliases: [],
    description: 'Allows you to play Poker Night in the current voice chat.',
    run: async(client, message, args) => {
        if(message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channelID, 'poker').then(async invite => {
                message.channel.send(
                    new MessageEmbed()
                        .setAuthor('Poker Night')
                        .setColor(client.config.colors.main)
                        .setDescription('This feature allows you play Poker along with other people in a voice chat. Click the link down below to start the fun.')
                        .addField('Invite link', invite.code)
                        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                );
            });
        } else {
            message.reply(`You need to be in a voice chat for this to work.`);
        }
    }
}