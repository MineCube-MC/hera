const chalk = require('chalk');
const { Client } = require('discord.js');
const config = require('../../config.json');

/**
 * @param {Client} client 
 */
module.exports = client => {
    console.log('[ApexieClient] Logged in as ' + chalk.italic(client.user.tag));
    console.log('[ApexieClient] Status => ' + chalk.greenBright('Ready!'));
    console.log('[ApexieClient] Type "' + chalk.italic(`${config.prefix}help`) + '" for a list of commands.');

    const randomMessage = Math.floor(Math.random() * config.messages.length);
    client.setInterval(() => {
        client.user.setActivity(`${config.messages[randomMessage]} | ${config.prefix}help`);
    }, (30 * 1000));
}