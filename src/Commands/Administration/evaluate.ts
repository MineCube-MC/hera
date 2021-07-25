import { Command } from '../../Interfaces';
import util from 'util';

export const command: Command = {
    name: 'evaluate',
    category: 'Administration',
    aliases: ['eval'],
    description: 'Evaluates the given JavaScript code',
    run: async(client, message, args) => {
        if (!client.config.owners.includes(message.author.id)) return message.reply("You are not allowed to execute this command.");
        const clean = text => {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }          
        try {
            const code = args.join(" ");
            if (!code) return message.reply("You must input a code.");
    
            let evaled;
            if (code.includes("token") || code.includes("setTimeout") || code.includes("setInterval")) {
                return message.reply("For security and performance purposes, some things in your code like tokens and timeouts are disabled.");
            } else {
                evaled = eval(code);
            }
    
            if (typeof evaled !== 'string') evaled = util.inspect(evaled, {depth: 0});
    
            const output = clean(evaled);
            message.reply('**Succesfully executed**\n```js\n' + output + '```');
        } catch (e) {
            e = clean(e);
            message.reply('**Error**\n```ts\n' + e + '```');
        }
    }
}