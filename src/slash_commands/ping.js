const { Message } = require('discord.js');

module.exports = {
    slash: true,
    testOnly: true,
    description: 'The classic test command for Discord bots, but evolved in a slash command.',
    /**
     * @param {Message} message 
     */
    callback: ({message, args}) => {
        return 'Hey, this is one of the slash commands tests on a Discord bot.';
    }
}