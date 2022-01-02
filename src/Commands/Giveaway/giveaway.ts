import { MessageEmbed, TextChannel } from 'discord.js';
import { Command } from '../../Interfaces';
import ms from 'ms';

export const command: Command = {
    name: 'giveaway',
    description: 'Start a new giveaway',
    options: [
        {
            name: 'duration',
            description: 'How long the giveaway should last for. Example values: 1m, 1h, 1d',
            type: 'STRING',
            required: true
        },
        {
            name: 'winners',
            description: 'How many winners the giveaway should have',
            type: 'INTEGER',
            required: true
        },
        {
            name: 'prize',
            description: 'What the prize of the giveaway should be',
            type: 'STRING',
            required: true
        },
        {
            name: 'channel',
            description: 'The channel to start the giveaway in',
            type: 'CHANNEL',
            required: true
        }
    ],
    async execute(interaction, client) {
        if(!interaction.memberPermissions.has('ADMINISTRATOR')) return interaction.reply({ content: `The \`ADMINISTRATOR\` permission is needed to execute this command!`, ephemeral: true});

        const giveawayChannel = interaction.options.getChannel('channel');
        const giveawayDuration = interaction.options.getString('duration');
        const giveawayWinnerCount = interaction.options.getInteger('winners');
        const giveawayPrize = interaction.options.getString('prize');
        
        if(((giveawayChannel): giveawayChannel is TextChannel => giveawayChannel.type === 'GUILD_TEXT' || giveawayChannel.type === 'GUILD_NEWS')(giveawayChannel)) {
            client.giveaways.start(giveawayChannel, {
                // The giveaway duration
                duration: ms(giveawayDuration),
                // The giveaway prize
                prize: giveawayPrize,
                // The giveaway winner count
                winnerCount: giveawayWinnerCount,
                // Who hosts this giveaway
                hostedBy: interaction.user
            });
        
            interaction.reply({ content: `Giveaway started in ${giveawayChannel}!`, ephemeral: true});
        } else {
            return interaction.reply({
                content: 'Selected channel is not text-based.',
                ephemeral: true
            });
        }
    }
}