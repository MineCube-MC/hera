const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {*} args 
 */
module.exports.run = async (client, message, args) => {
    message.reply('Hey, this is one of the classic tests on a Discord bot!');
}

module.exports.config = {
    name: 'ping',
    aliases: ['test']
}