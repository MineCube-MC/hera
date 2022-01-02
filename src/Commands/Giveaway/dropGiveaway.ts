import { MessageEmbed, TextChannel } from 'discord.js';
import { Command } from '../../Interfaces';
import ms from 'ms';

export const command: Command = {
    name: 'dropiveaway',
    description: 'Start a new drop giveaway',
    options: [
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
        const giveawayWinnerCount = interaction.options.getInteger('winners');
        const giveawayPrize = interaction.options.getString('prize');
        
        if(((giveawayChannel): giveawayChannel is TextChannel => giveawayChannel.type === 'GUILD_TEXT' || giveawayChannel.type === 'GUILD_NEWS')(giveawayChannel)) {
            client.giveaways.start(giveawayChannel, {
                // The number of winners for this drop
                winnerCount: giveawayWinnerCount,
                // The prize of the giveaway
                prize: giveawayPrize,
                // Who hosts this giveaway
                hostedBy: interaction.user,
                // specify drop
                isDrop: true
            });
        
            interaction.reply(`Giveaway started in ${giveawayChannel}!`);
        } else {
            return interaction.reply({
                content: 'Selected channel is not text-based.',
                ephemeral: true
            });
        }
    }
}