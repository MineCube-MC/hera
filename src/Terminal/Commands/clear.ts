import { TerminalCommand } from '../../Interfaces';

export const command: TerminalCommand = {
    name: 'clear',
    description: 'Cleans the terminal a little bit',
    async execute(client) {
        console.clear();
    }
}