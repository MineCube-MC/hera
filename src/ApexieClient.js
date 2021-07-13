const chalk = require('chalk');
const { Client, Intents, Collection } = require('discord.js');
const Config = require('../config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const { loadCommands } = require('./utils/loadCommands');
loadCommands(client)
require('./utils/loadEvents')(client);

client.commands = new Collection();
client.aliases = new Collection();

client.login(Config.token);