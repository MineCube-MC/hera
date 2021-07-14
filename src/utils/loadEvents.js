const chalk = require('chalk');
const fs = require('fs');
const { Client } = require('discord.js');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @param {Client} client 
 */
module.exports = client => {
    fs.readdir("src/events/", (_err, files) => {
        files.forEach((file) => {
            if (!file.endsWith(".js")) return;
            const event = require(`../events/${file}`);
            let eventName = file.split(".")[0];
            client.on(eventName, event.bind(null, client));
            delete require.cache[require.resolve(`../events/${file}`)];
            console.log(`[ApexieClient] ${chalk.underline(capitalize(eventName))} event => ${chalk.magentaBright('Loaded!')}`);
        });
    });
}