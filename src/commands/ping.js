const { Client, Message } = require('discord.js');

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {*} args 
 */
module.exports = {
    name: 'ping',
    category: 'General',
    aliases: ['test'],
    description: 'The classic test command for Discord bots, of course.',

    run: async (client, message, args) => {
        message.reply('Hey, this is one of the classic tests on a Discord bot!');
    }
}