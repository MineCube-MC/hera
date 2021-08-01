import { Command } from '../../Interfaces';
import util from 'util';
import chalk from 'chalk';

export const command: Command = {
    name: 'evaluate',
    category: 'Administration',
    aliases: ['eval'],
    description: 'Evaluates the given JavaScript code',
    run: async(client, args, message) => {
        if(message) {
            if (!client.config.owners.includes(message.author.id)) return message.reply("You are not allowed to execute this command.");
        }
        const clean = text => {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }          
        try {
            const code = args.join(" ");
            if (!code) {
                if(message) return message.reply("You must input a code.");
                if(!message) return console.log("You must input a code.");
            }
    
            let evaled;
            if (code.includes("token") || code.includes("setTimeout") || code.includes("setInterval")) {
                if(message) return message.reply("For security and performance purposes, some things in your code like tokens and timeouts are disabled.");
            } else {
                evaled = eval(code);
            }
    
            if (typeof evaled !== 'string') evaled = util.inspect(evaled, {depth: 0});
    
            const output = clean(evaled);
            if(!message) console.log(`${chalk.greenBright('Successfully executed')}:\n${output}`);
            if(message) message.reply('**Succesfully executed**\n```js\n' + output + '```');
        } catch (e) {
            e = clean(e);
            if(!message) console.log(e);
            if(message) message.reply('**Error**\n```ts\n' + e + '```');
        }
    }
}