import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'ping',
    type: 'bot',
    category: 'General',
    aliases: ['wsping', 'testing'],
    run: async(client, args, message) => {
        const msg = await message.reply(":ping_pong: Pinging...");
        msg.edit(`**Discord API:** ${client.ws.ping}ms\n**Message:** ${msg.createdTimestamp - message.createdTimestamp}ms`);
    }
}