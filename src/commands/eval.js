const { Client, Message } = require('discord.js');
const config = require("../../config.json");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {*} args 
 */
module.exports = {
    name: 'eval',
    category: 'Developer Only',
    aliases: ['evaluate', 'ev'],
    description: 'Evaluates a JavaScript code.',

    run: async (client, message, args) => {
        try {
            if (!config.owners.includes(message.author.id)) return message.reply("You are not allowed to execute this command.");
            const code = args.join(" ");
            if (!code) return message.reply("You must input a code.");
    
            let evaled;
            if (code.includes("token")) {
                return message.reply("For security purposes, I can't show my bot token.");
            } else {
                evaled = eval(code);
            };
    
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled, {depth: 0});
    
            const output = clean(evaled);
            message.reply('**Succesfully executed**\n```js\n' + output + '```');
        } catch (e) {
            e = clean(e);
            message.reply('**Error**\n```js\n' + e + '```');
        }
    }
}

function clean(string) {
    if (typeof text === 'string') {
      return string.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
    } else {
      return string;
    }
  };