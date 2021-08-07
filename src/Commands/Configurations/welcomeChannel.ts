import { Command } from '../../Interfaces';
import { welcomeChannelSchema as Schema } from '../../Models/welcomeChannel';
import { welcomeChannelCollection as Collection } from '../../Collections';

export const command: Command = {
    name: 'welcomechannel',
    type: 'bot',
    category: 'Configurations',
    description: 'Change the welcome channel',
    run: async(client, args, interaction) => {
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('ADMINISTRATOR')) return interaction.reply(`You don't have enough permissions to use this command.`);

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

            return interaction.reply({ content: `Your welcome channel has been updated to <#${newChannel}>`, ephemeral: true });
        } else return interaction.reply({ content: 'You need to specify a channel you want to use.', ephemeral: true });
    }
}