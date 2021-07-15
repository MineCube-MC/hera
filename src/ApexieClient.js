const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');
const mongoose = require('mongoose');
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

mongoose.connect(config.mongodb_srv, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log(`[ApexieClient] Database => ${chalk.greenBright('Connected!')}`);
}).catch((err) => {
    console.log(err);
});

/* client.db = require("quick.db");
client.request = new (require("rss-parser"))();

function handleUploads() {
    if (client.db.fetch(`postedVideos`) === null) client.db.set(`postedVideos`, []);
    setInterval(() => {
        client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${client.config.channel_id}`)
        .then(data => {
            if (client.db.fetch(`postedVideos`).includes(data.items[0].link)) return;
            else {
                client.db.set(`videoData`, data.items[0]);
                client.db.push("postedVideos", data.items[0].link);
                let parsed = client.db.fetch(`videoData`);
                let channel = client.channels.cache.get(client.config.channel);
                if (!channel) return;
                let message = client.config.messageTemplate
                    .replace(/{author}/g, parsed.author)
                    .replace(/{title}/g, Discord.Util.escapeMarkdown(parsed.title))
                    .replace(/{url}/g, parsed.link);
                channel.send(message);
            }
        });
    }, client.config.watchInterval);
} */

client.login(config.token);