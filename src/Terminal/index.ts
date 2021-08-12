import readline from 'readline';
import ExtendedClient from '../Client';
import { TerminalCommand } from '../Interfaces';
import { readdirSync, readFileSync } from 'fs';
import chalk from 'chalk';
import path from 'path';

export class ClientPrompt {

    public rl = readline.createInterface(process.stdin, process.stdout);

    public constructor(client: ExtendedClient) {
        const commandPath = path.join(__dirname, "Commands");
        const commands = readdirSync(`${commandPath}`).filter((file) => file.endsWith('.ts'));

        commands.forEach(async (file) => {
            try {
                const { command } = await import(`${commandPath}/${file}`);
                if(!command?.name) return;
                client.terminalCmds.set(command.name, command);
                console.log(`[Client] ${chalk.underline(client.capitalize(command.name))} command => ${chalk.cyanBright('Loaded!')}`);
            } catch (e) {
                console.log(`[Client] ${chalk.underline(client.capitalize(file.replace(/.ts/g,'')))} command => ${chalk.redBright(`Doesn't export a terminal command`)}`);
            }
        });

        this.rl.setPrompt('-> ');
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
        }
        this.rl.prompt();
    }

}