import readline from 'readline';
import ExtendedClient from '../Client';
import { Command } from '../Interfaces';

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
        // const cmd = client.commands.get(command);
        // if(cmd) {
        //     if(cmd.type === 'console' || cmd.type === 'both' || !cmd.type) {
        //         (cmd as Command).run(client, args);
        //     } else {
        //         console.log('This command is only available in the Discord bot client');
        //     }
        // }
        this.rl.prompt();
    }

}