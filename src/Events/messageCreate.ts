import { Event, Command } from '../Interfaces';
import { Message } from 'discord.js';
import { prefixSchema as mongoPrefixSchema } from '../Models/prefix';
import { prefixCollection } from '../Collections/prefix';

export const event: Event = {
    name: 'messageCreate',
    run: async (client, message: Message) => {
        if(
            message.author.bot ||
            !message.guild
        ) return;

        const prefix = prefixCollection.get(message.guild.id) || client.config.prefix;

        if(!message.content.startsWith(prefix)) return;

        const args = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/g);
        
        const cmd = args.shift().toLowerCase();
        if(!cmd) return;
        const command = client.commands.get(cmd) || client.aliases.get(cmd);
        if(command) {
            if(command.type === 'bot' || command.type === 'both' || !command.type) {
                if(client.executedCooldown.has(message.author.id)) {
                    return message.reply(`You need to wait some seconds before executing another command.`);
                } else {
                    (command as Command).run(client, args, message);
                    client.executedCooldown.add(message.author.id);
                    setTimeout(() => {
                        client.executedCooldown.delete(message.author.id);
                    }, (5 * 1000));
                }
            }
        }
    }
}