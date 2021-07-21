import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'ping',
    category: 'General',
    aliases: ['wsping', 'testing'],
    run: async(client, message, args) => {
        const msg = await message.reply(":ping_pong: Pinging...");
        msg.edit(`**Discord API:** ${client.ws.ping}ms\n**Message:** ${msg.createdTimestamp - message.createdTimestamp}ms`);
    }
}