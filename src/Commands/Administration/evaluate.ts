import { Command } from '../../Interfaces';
import util from 'util';
import chalk from 'chalk';

export const command: Command = {
    name: 'evaluate',
    options: [
        {
            name: 'code',
            description: 'The JavaScript code you want to evaluate',
            type: 'STRING',
            required: true
        }
    ],
    description: 'Evaluates the given JavaScript code (bot owners only!)',
    async execute(interaction, client) {
        if (!client.config.owners.includes(interaction.user.id)) return interaction.reply({ content: "You are not allowed to execute this command.", ephemeral: true });
        const clean = text => {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }          
        try {
            const code = interaction.options.getString("code");
    
            let evaled;
            if (code.includes("token") || code.includes("setTimeout") || code.includes("setInterval")) {
                return interaction.reply({ content: "For security and performance purposes, some things in your code like tokens and timeouts are disabled.", ephemeral: true });
            } else {
                evaled = eval(code);
            }
    
            if (typeof evaled !== 'string') evaled = util.inspect(evaled, {depth: 0});
    
            const output = clean(evaled);
            interaction.reply({ content: '**Succesfully executed**\n```js\n' + output + '```', ephemeral: true });
        } catch (e) {
            e = clean(e);
            interaction.reply({ content: '**Error**\n```ts\n' + e + '```', ephemeral: true });
        }
    }
}