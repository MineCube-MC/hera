import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'poll',
    category: 'General',
    description: 'Start a poll where you choose between yes and no.',
    aliases: [],
    usage: '<#channel> [description]',
    run: async(client, message, args) => {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply(`You don't have enough permissions to use this command.`);

        let channelID = message.mentions.channels.first();
        let theDescription = args.slice(1).join(" ");

        if(!channelID) return message.reply("Please specify a channel you want the poll to be in.");
        if(!theDescription) return message.reply("Please specify a description/question for the poll.");

        const embed = new MessageEmbed()
        .setColor(client.config.colors.main)
        .setTitle("POLL TIME")
        .setDescription(theDescription)
        .setFooter("Poll started by "+ message.author.username, message.author.displayAvatarURL({ dynamic: true }));

        let msgEmbed = await channelID.send(embed);
        await msgEmbed.react('✅');
        await msgEmbed.react('❌');
    }
}