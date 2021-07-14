const chalk = require('chalk');
const { Client } = require('discord.js');

/**
 * @param {Client} client 
 */
module.exports = client => {
    console.log('[ApexieClient] Logged in as ' + chalk.italic(client.user.tag));
    console.log('[ApexieClient] Status => ' + chalk.greenBright('Ready!'));
}