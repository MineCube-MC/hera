const chalk = require('chalk');
const { Client } = require('discord.js');
const WOKCommands = require('wokcommands');
const config = require('../../config.json');

/**
 * @param {Client} client 
 */
module.exports = client => {
    console.log('[ApexieClient] Logged in as ' + chalk.italic(client.user.tag));
    console.log('[ApexieClient] Status => ' + chalk.greenBright('Ready!'));
    console.log('[ApexieClient] Type ' + chalk.italic(`"${config.prefix}help"`) + ' for a list of commands.');

    new WOKCommands(client, {
        commandsDir: 'slash_commands',
        testServers: config.features.testGuildId,
        disabledDefaultCommands: [
            'help',
            'command',
            'language',
            'requiredrole'
        ],
        showWarns: false
    })
    .setDefaultPrefix(config.prefix)
    .setColor(config.colors.main)
    .setMongoPath(config.mongodb_srv);

    const randomMessage = Math.floor(Math.random() * config.messages.length);
    client.setInterval(() => {
        client.user.setActivity(`${config.messages[randomMessage]} | ${config.prefix}help`);
    }, (30 * 1000));
}