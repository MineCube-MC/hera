import { Command } from '../../Interfaces';
import { prefixSchema as Schema } from '../../Models/prefix';
import { prefixCollection as Collection } from '../../Collections';

export const command: Command = {
    name: 'prefix',
    type: 'bot',
    category: 'Configurations',
    description: 'Change the server prefix',
    aliases: ['changeprefix', 'prefixchange'],
    usage: '<prefix>',
    run: async(client, args, message) => {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply(`You don't have enough permissions to use this command.`);

        const newPrefix = args[0];

        if(newPrefix) {
            Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
                if(!data) {
                    new Schema({
                        Guild: message.guild.id,
                        Prefix: newPrefix
                    }).save();
                    Collection.set(message.guild.id, newPrefix);
                } else {
                    data.Prefix = newPrefix;
                    data.save();
                    Collection.set(message.guild.id, newPrefix.toString());
                }
            });

            return message.reply(`Your server prefix has been updated to \`${newPrefix}\``);
        } else return message.reply('You need to specify a prefix you want to use.');
    }
}