const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');
const { Client, Intents, Collection } = require('discord.js');
const config = require('../config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

clear();
console.log(chalk.cyanBright(figlet.textSync('Apexie', { horizontalLayout: 'full' })));

require('./utils/loadEvents')(client);
const { loadCommands } = require('./utils/loadCommands');
loadCommands(client);

client.commands = new Collection();
client.aliases = new Collection();

client.login(config.token);