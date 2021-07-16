const chalk = require('chalk');
const fs = require('fs');
const { Client } = require('discord.js');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @param {Client} client 
 */
function loadCommands(client) {
    fs.readdir('src/commands/', (err, files) => {

        if (err) console.log(err);

        const jsfile = files.filter(f => f.split('.').pop() === 'js');
        if (jsfile.length <= 0) {
            return console.log(`[ApexieClient] ${chalk.redBright('Client couldn\'t find any commands.')}`);
        }

        jsfile.forEach((f, i) => {
            const pull = require(`../commands/${f}`);
            client.commands.set(pull.name, pull);
            console.log(`[ApexieClient] ${chalk.underline(capitalize(pull.name))} command => ${chalk.yellowBright('Loaded!')}`);
            if(pull.aliases) {
                pull.aliases.forEach(alias => {
                    client.aliases.set(alias, pull.name);
                });
            }
        });
    });
}

module.exports = {
    loadCommands
}