import { Command } from '../../Interfaces';
import { prefixSchema as Schema } from '../../Models/prefix';
import { prefixCollection as Collection } from '../../Collections/prefix';

export const command: Command = {
    name: 'prefix',
    category: 'Configurations',
    description: 'Change the server prefix',
    aliases: ['changeprefix', 'prefixchange'],
    usage: '<prefix>',
    run: async(client, message, args) => {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply(`You don't have enough permissions to use this command.`);

        const newPrefix = args[0];

        if(newPrefix) {
            const prefixSchema = await Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
                if(!data) {
                    const newGuild = new Schema({
                        Guild: message.guild.id,
                        Prefix: client.config.prefix
                    }).save();
                    Collection.set(message.guild.id, client.config.prefix);
                }
            });

            await prefixSchema.updateOne({
                prefix: newPrefix
            });
            Collection.set(message.guild.id, newPrefix.toString());

            return message.reply(`Your server prefix has been updated to \`${newPrefix}\``);
        } else message.reply('You need to specify a prefix you want to use.');
    }
}