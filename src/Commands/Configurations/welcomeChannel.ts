import { Command } from '../../Interfaces';
import { welcomeChannelSchema as Schema } from '../../Models/welcomeChannel';
import { welcomeChannelCollection as Collection } from '../../Collections';

export const command: Command = {
    name: 'welcomechannel',
    type: 'bot',
    category: 'Configurations',
    aliases: [],
    description: 'Change the welcome channel',
    run: async(client, args, message) => {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply(`You don't have enough permissions to use this command.`);

        if(args[0] == 'disable') {
            Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
                if(!data) {
                    new Schema({
                        Guild: message.guild.id,
                        Channel: 'disabled'
                    }).save();
                    Collection.set(message.guild.id, 'disabled');
                } else {
                    data.Channel = 'disabled';
                    data.save();
                    Collection.set(message.guild.id, 'disabled');
                }
            });
        } else return message.reply(`These are the available options: \`disable\`, \`#channel-name\``);

        const newChannel = message.mentions.channels.first()?.id;

        if(newChannel) {
            Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
                if(!data) {
                    new Schema({
                        Guild: message.guild.id,
                        Channel: newChannel
                    }).save();
                    Collection.set(message.guild.id, newChannel);
                } else {
                    data.Channel = newChannel;
                    data.save();
                    Collection.set(message.guild.id, newChannel.toString());
                }
            });

            return message.reply(`Your welcome channel has been updated to <#${newChannel}>`);
        } else return message.reply('You need to specify a channel you want to use.');
    }
}