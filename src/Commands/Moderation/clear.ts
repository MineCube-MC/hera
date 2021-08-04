import { TextChannel } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'clear',
    type: 'bot',
    category: 'Moderation',
    aliases: ['purge', 'delete'],
    description: 'Delete up to 100 messages at once',
    run: async(client, args, message) => {
        if (!args[0]) return message.reply('You haven\'t given an amount of messages which should be deleted!');
        const intArgs = parseInt(args[0]);
        if (isNaN(intArgs)) return message.reply("The amount parameter isn't a number!");
        if (intArgs > 100) return message.reply("You can't delete more than 100 messages at once!");
        if (intArgs < 1) return message.reply('You have to delete at least 1 message!');

        if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply("You haven't the permission to execute this command!");
    
        await message.channel.messages.fetch({ limit: intArgs }).then(messages => {
            message.delete();
            (<TextChannel> message.channel).bulkDelete(messages);
        });
    }
}