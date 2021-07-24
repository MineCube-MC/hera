import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'restart',
    category: 'Administration',
    aliases: ['reboot'],
    description: 'Restarts the client',
    run: async(client, message, args) => {
        message.reply('The bot is restarting').then(() => client.restart());
    }
}