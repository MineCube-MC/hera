import chalk from 'chalk';
import readline from 'readline';
import ExtendedClient from '../Client';
import { TerminalCommand } from '../Interfaces';
import packageJson from '../../package.json';

export class ClientPrompt {

    public rl = readline.createInterface(process.stdin, process.stdout);

    public constructor(client: ExtendedClient) {
        if(client.config.terminal.fancyTerminal) {
            let platform = '';
            if(process.platform == 'win32') platform = ' ';
            this.rl.setPrompt(`\n${chalk.cyanBright(`${platform}${packageJson.name}`)} ${chalk.yellowBright('::')} ${chalk.magentaBright(`npm(${chalk.yellowBright(packageJson.version)})`)} \n${chalk.greenBright('➜')} `);
        } else {
            this.rl.setPrompt(`-> `);
        }
        this.rl.prompt();

        this.rl.on('line', (cmd) => {
            const args = cmd.trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            this.exec(command, args, client);
        });
    }

    public exec(command: string, args: string[], client: ExtendedClient) {
        const cmd = client.terminalCmds.get(command);
        if(cmd) {
            (cmd as TerminalCommand).execute(client, args);
        } else console.error(chalk.redBright(`${command}: command not found`));
        this.rl.prompt();
    }

}