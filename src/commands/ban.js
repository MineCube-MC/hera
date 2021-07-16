const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ban',
    category: 'Moderation',
    aliases: ['banhammer'],
    description: 'Bans a user from the Discord server.',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        message.reply('Sorry, but this is still W.I.P.');
    }
}