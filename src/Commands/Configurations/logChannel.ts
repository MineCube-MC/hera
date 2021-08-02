import { Command } from '../../Interfaces';
import { moderationLogsSchema as Schema } from '../../Models/moderationLogs';
import { moderationLogsCollection as Collection } from '../../Collections';

export const command: Command = {
    name: 'logchannel',
    type: 'bot',
    category: 'Configurations',
    aliases: [],
    description: 'Change the moderation logs channel',
    run: async(client, args, message) => {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply(`You don't have enough permissions to use this command.`);

        const newChannel = message.mentions.channels.first()?.id;
        let currentChannel = message.channel.id;

        if(newChannel) {
            const logsSchema = await Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
                if(!data) {
                    const newGuild = new Schema({
                        Guild: message.guild.id,
                        Channel: currentChannel
                    }).save();
                    Collection.set(message.guild.id, currentChannel);
                }
            });

            await logsSchema.updateOne({
                channel: newChannel
            });
            Collection.set(message.guild.id, newChannel.toString());

            return message.reply(`Your moderation logs channel has been updated to <#${newChannel}>`);
        } else message.reply('You need to specify a channel you want to use.');
    }
}