import { Command } from '../../Interfaces';
import util from 'util';
import chalk from 'chalk';

export const command: Command = {
    name: 'evaluate',
    category: 'Administration',
    description: 'Evaluates the given JavaScript code',
    run: async(client, args, interaction) => {
        if(interaction) {
            if (!client.config.owners.includes(interaction.user.id)) return interaction.reply("You are not allowed to execute this command.");
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
                if(interaction) return interaction.reply({ content: "You must input a code.", ephemeral: true });
                if(!interaction) return console.log("You must input a code.");
            }
    
            let evaled;
            if (code.includes("token") || code.includes("setTimeout") || code.includes("setInterval")) {
                if(interaction) return interaction.reply({ content: "For security and performance purposes, some things in your code like tokens and timeouts are disabled.", ephemeral: true});
            } else {
                evaled = eval(code);
            }
    
            if (typeof evaled !== 'string') evaled = util.inspect(evaled, {depth: 0});
    
            const output = clean(evaled);
            if(!interaction) console.log(`${chalk.greenBright('Successfully executed')}:\n${output}`);
            if(interaction) interaction.reply({ content: '**Succesfully executed**\n```js\n' + output + '```', ephemeral: true });
        } catch (e) {
            e = clean(e);
            if(!interaction) console.log(e);
            if(interaction) interaction.reply({ content: '**Error**\n```ts\n' + e + '```', ephemeral: true });
        }
    }
}