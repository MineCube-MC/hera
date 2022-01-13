import { TextChannel } from "discord.js";
import { Command } from "../../structures/Command";
import ms from 'ms';

export default new Command({
    name: "giveaway",
    description: "Start a new giveaway in this guild",
    userPermissions: ["MANAGE_EVENTS", "MODERATE_MEMBERS", "MANAGE_MESSAGES"],
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
    run: async({ interaction, client }) => {
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
        
            interaction.followUp({ content: `Giveaway started in ${giveawayChannel}!`, ephemeral: true});
        } else {
            return interaction.followUp({
                content: 'Selected channel is not text-based.',
                ephemeral: true
            });
        }
    }
});