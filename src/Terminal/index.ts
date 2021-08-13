import readline from 'readline';
import ExtendedClient from '../Client';
import { TerminalCommand } from '../Interfaces';

export class ClientPrompt {

    public rl = readline.createInterface(process.stdin, process.stdout);

    public constructor(client: ExtendedClient) {
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