import { TerminalCommand } from '../../Interfaces';
import chalk from 'chalk';

export const command: TerminalCommand = {
    name: 'help',
    description: 'Gives a list of commands',
    usage: '[command]',
    async execute(client, args) {
        const command = args[0];

        const cmdInfo = `${chalk.greenBright('%name%')} Command Info:\n- Description: %description%\n- Usage: \'%name% %usage%\'`;

        const cmdList = `These are the available terminal commands:\n%list%`;

        if(command) {
            const cmd = client.terminalCmds.get(command);
            if(!cmd) return console.error(`There's no terminal command with that name!`);
            return console.log(cmdInfo.replaceAll('%name%', client.capitalize(cmd.name)).replaceAll('%description%', cmd.description).replaceAll('%usage%', cmd.usage));
        } else {
            const list = client.terminalCmds.map(cmd => `\'${cmd.name}\'`).join(', ');
            return console.log(cmdList.replaceAll('%list%', list));
        }
    }
}