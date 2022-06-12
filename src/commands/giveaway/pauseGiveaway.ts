import { Command } from "../../structures/Command";

export default new Command({
    name: "pausegiveaway",
    description: "Pause an existing giveaway",
    userPermissions: ["MANAGE_EVENTS", "MODERATE_MEMBERS", "MANAGE_MESSAGES"],
    options: [
        {
            name: 'giveaway',
            description: 'The giveaway to pause or unpause (message ID or giveaway prize)',
            type: 'STRING',
            required: true
        }
    ],
    run: async({ client, interaction, args }) => {
        const query = args.getString('giveaway');

        const giveaway = 
            client.giveaways.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            client.giveaways.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        if (!giveaway) {
            return interaction.reply({
                content: 'Unable to find a giveaway for `'+ query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.ended) {
            return interaction.reply({
                content: 'This giveaway is already ended.',
                ephemeral: true
            });
        }

        if (giveaway.pauseOptions.isPaused) {
            return client.giveaways.unpause(giveaway.messageId)
            .then(() => {
                interaction.reply('Giveaway unpaused!');
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });
        }

        client.giveaways.pause(giveaway.messageId, {
            content: '⚠️ **THIS GIVEAWAY IS PAUSED !** ⚠️',
            unPauseAfter: null,
            embedColor: '#FFFF00'
        })
        .then(() => {
            interaction.reply('Giveaway paused!');
        })
        .catch((e) => {
            interaction.reply({
                content: e,
                ephemeral: true
            });
        });
    }
});