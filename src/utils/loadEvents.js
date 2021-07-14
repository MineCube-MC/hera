const fs = require('fs');
const { Client } = require('discord.js');

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
        });
    });
}