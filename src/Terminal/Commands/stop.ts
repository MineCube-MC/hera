import { TerminalCommand } from '../../Interfaces';

export const command: TerminalCommand = {
    name: 'stop',
    description: 'Shuts down the client and closes the database connection',
    async execute(client) {
        client.shutdown();
    }
}