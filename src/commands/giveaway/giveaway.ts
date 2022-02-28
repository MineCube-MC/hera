import { TextChannel } from "discord.js";
import { Command } from "../../structures/Command";
import ms from 'ms';

export default new Command({
    name: "giveaway",
    description: "Start a new giveaway in this guild",
    userPermissions: ["MANAGE_EVENTS", "MODERATE_MEMBERS", "MANAGE_MESSAGES"],
    options: [
        {
            name: "normal",
            description: "Start a new giveaway in this guild",
            type: "SUB_COMMAND",
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
            ]
        },
        {
            name: "drop",
            description: "Start a new drop giveaway in this guild",
            type: "SUB_COMMAND",
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
            ]
        }
    ],
    run: async({ client, interaction, args }) => {
        const giveawayChannel = args.getChannel('channel');
        const giveawayDuration = args.getString('duration');
        const giveawayWinnerCount = args.getInteger('winners');
        const giveawayPrize = args.getString('prize');
        
        if(args.getSubcommand() === "normal") {
            if(((giveawayChannel): giveawayChannel is TextChannel => giveawayChannel.type === 'GUILD_TEXT' || giveawayChannel.type === 'GUILD_NEWS')(giveawayChannel)) {
                client.giveaways.start(giveawayChannel, {
                    duration: ms(giveawayDuration),
                    prize: giveawayPrize,
                    winnerCount: giveawayWinnerCount,
                    hostedBy: interaction.user
                });
            
                interaction.reply({ content: `Giveaway started in ${giveawayChannel}!`, ephemeral: true});
            } else {
                return interaction.reply({
                    content: 'Selected channel is not text-based.',
                    ephemeral: true
                });
            }
        } else if(args.getSubcommand() === "drop") {
            if(((giveawayChannel): giveawayChannel is TextChannel => giveawayChannel.type === 'GUILD_TEXT' || giveawayChannel.type === 'GUILD_NEWS')(giveawayChannel)) {
                client.giveaways.start(giveawayChannel, {
                    winnerCount: giveawayWinnerCount,
                    prize: giveawayPrize,
                    hostedBy: interaction.user,
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
});