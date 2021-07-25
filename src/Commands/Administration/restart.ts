import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'restart',
    category: 'Administration',
    aliases: ['reboot'],
    description: 'Restarts the client',
    run: async(client, message, args) => {
        if (!client.config.owners.includes(message.author.id)) return message.reply("You are not allowed to execute this command.");
        message.reply('The bot is restarting').then(() => client.restart());
    }
}