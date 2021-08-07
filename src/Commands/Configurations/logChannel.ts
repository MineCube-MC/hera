import { Command } from '../../Interfaces';
import { moderationLogsSchema as Schema } from '../../Models/moderationLogs';
import { moderationLogsCollection as Collection } from '../../Collections';

export const command: Command = {
    name: 'logchannel',
    type: 'bot',
    category: 'Configurations',
    description: 'Change the moderation logs channel',
    run: async(client, args, interaction) => {
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `You don't have enough permissions to use this command.`, ephemeral: true });

        if(args[0] == 'disable') {
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(!data) {
                    new Schema({
                        Guild: interaction.guild.id,
                        Channel: 'disabled'
                    }).save();
                    Collection.set(interaction.guild.id, 'disabled');
                } else {
                    data.Channel = 'disabled';
                    data.save();
                    Collection.set(interaction.guild.id, 'disabled');
                }
            });
        } else return interaction.reply({ content: `These are the available options: \`disable\`, \`#channel-name\``, ephemeral: true });

        const newChannel = interaction.options.getChannel("channel")?.id;

        if(newChannel) {
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(!data) {
                    new Schema({
                        Guild: interaction.guild.id,
                        Channel: newChannel
                    }).save();
                    Collection.set(interaction.guild.id, newChannel);
                } else {
                    data.Channel = newChannel;
                    data.save();
                    Collection.set(interaction.guild.id, newChannel.toString());
                }
            });

            return interaction.reply({ content: `Your moderation logs channel has been updated to <#${newChannel}>`, ephemeral: true });
        } else return interaction.reply({ content: 'You need to specify a channel you want to use.', ephemeral: true });
    }
}