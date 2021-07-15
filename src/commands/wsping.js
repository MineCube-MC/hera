const { Client, Message } = require("discord.js");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {*} args 
 */
 module.exports = {
    name: 'wsping',
    category: 'General',
    aliases: ['latency'],
    description: 'Calculates Discord API\'s ping.',

    run: async (client, message, args) => {
        const msg = await message.reply(":ping_pong: Pinging...");
        msg.edit(`**Discord API:** ${client.ws.ping}ms\n**Message:** ${msg.createdTimestamp - message.createdTimestamp}ms`);
    }
}