import { Command } from '../../Interfaces';
import { guildsSchema as Schema } from '../../Models/guilds';

export const command: Command = {
    name: 'welcomechannel',
    options: [
        {
            name: 'set',
            description: 'Enable this module and choose a channel for it',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to set as the welcome channel',
                    type: 'CHANNEL',
                    required: true
                }
            ]
        },
        {
            name: 'disable',
            description: 'Disable this module in the server',
            type: 'SUB_COMMAND'
        }
    ],
    description: 'Helps the administrators of the guild to configure the welcome channel module',
    async execute(interaction, client) {
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `You don't have enough permissions to use this command.`, ephemeral: true });

        const action = interaction.options.getSubcommand(true);

        if(action === 'set') {
            const newChannel = interaction.options.getChannel("channel")?.id;
            Schema.findOne({ guild: interaction.guild.id }, async(err, data) => {
                if(!data) {
                    new Schema({
                        guild: interaction.guild.id,
                        channels: {
                            welcome: newChannel
                        }
                    }).save();
                } else {
                    data.channels.welcome = newChannel;
                    data.save();
                }
            });

            return interaction.reply({ content: `The welcome channel has been updated to <#${newChannel}>`, ephemeral: true });
        } else if(action === 'disable') {
            Schema.findOne({ guild: interaction.guild.id }, async(err, data) => {
                if(!data) {
                    new Schema({
                        guild: interaction.guild.id,
                        channels: {
                            welcome: 'disabled'
                        }
                    }).save();
                } else {
                    data.channels.welcome = 'disabled';
                    data.save();
                }
            });

            return interaction.reply({ content: `The welcome channel module has been disabled`, ephemeral: true });
        }
    }
}