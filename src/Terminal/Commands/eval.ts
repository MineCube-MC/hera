import { TerminalCommand } from '../../Interfaces';
import util from 'util';
import chalk from 'chalk';

export const command: TerminalCommand = {
    name: 'eval',
    description: 'Evaluates the given JavaScript code',
    usage: '<code>',
    async execute(client, args) {
        const clean = text => {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }          
        try {
            const code = args.join(" ");
            if(!args) return console.log(chalk.redBright("You need to input a code to execute"));
    
            let evaled = eval(code);
    
            if (typeof evaled !== 'string') evaled = util.inspect(evaled, {depth: 0});
        } catch (e) {
            e = clean(e);
            console.log(chalk.redBright('Error') + '\n' + e);
        }
    }
}