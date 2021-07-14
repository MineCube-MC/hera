const { Client, Message } = require('discord.js');

/**
 * @param {Client} client 
 * @param {Message} message 
 */
module.exports = async (client, message) => {
    if (message.author.bot) return;

    const messageArray = message.content.split(' ');
    const cmd = messageArray[0];
    const args = messageArray.slice(1);

    if (message.author.bot || message.channel.type === 'dm') return;
    const prefix = '/';

    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`)))
        return message.reply(`The prefix of the client is \`${prefix}\``);

    const commandfile = client.commands.get(cmd.slice(prefix.length).toString().toLowerCase()) || client.commands.get(client.aliases.get(cmd.slice(prefix.length).toString().toLowerCase()));;
    if (commandfile) {
        commandfile.run(client, message, args);
    }
}