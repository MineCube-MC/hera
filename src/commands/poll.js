const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'poll',
    category: 'Utilities',
    description: 'Make a quick poll with the desired options.',

    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    async run (client, message, args) {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply(`You don't have enough permissions to use this command.`);

        let channelID = message.mentions.channels.first();
        let theDescription = args.slice(1).join(" ");

        if(!channelID) return message.reply("Please specify a channel you want the poll to be in.");
        if(!theDescription) return message.reply("Please specify a description/question for the poll.");

        const embed = new MessageEmbed()
        .setColor("YELLOW")
        .setTitle("POLL TIME")
        .setDescription(theDescription)
        .setFooter("Poll started by "+ message.author.tag, message.author.displayAvatarURL({ dynamic: true }));

        let msgEmbed = await channelID.send(embed);
        await msgEmbed.react('✅');
        await msgEmbed.react('❌');
    }
}