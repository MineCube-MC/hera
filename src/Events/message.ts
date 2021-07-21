import { Event, Command } from '../Interfaces';
import { Message } from 'discord.js';
import { prefixSchema as mongoPrefixSchema } from '../Models/prefix';
import { prefixCollection } from '../Collections/prefix';

export const event: Event = {
    name: 'message',
    run: async (client, message: Message) => {
        if(
            message.author.bot ||
            !message.guild
        ) return;

        const prefixSchema = await mongoPrefixSchema.findOne({ Guild: message.guild.id }, async(err, data) => {
            if(!data) {
                const newGuild = new mongoPrefixSchema({
                    Guild: message.guild.id,
                    Prefix: client.config.prefix
                });

                newGuild.save();
                prefixCollection.set(message.guild.id, client.config.prefix);
            }
        });

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
            if(client.executedCooldown.has(message.author.id)) {
                return message.reply(`You need to wait some seconds before executing another command.`);
            } else {
                (command as Command).run(client, message, args);
                client.executedCooldown.add(message.author.id);
                setTimeout(() => {
                    client.executedCooldown.delete(message.author.id);
                }, (5 * 1000));
            }
        }
    }
}