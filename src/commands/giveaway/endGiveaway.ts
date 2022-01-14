import { Command } from "../../structures/Command";

export default new Command({
    name: "endgiveaway",
    description: "End an existing giveaway",
    userPermissions: ["MANAGE_EVENTS", "MODERATE_MEMBERS", "MANAGE_MESSAGES"],
    options: [
        {
            name: 'giveaway',
            description: 'The giveaway to end (message ID or giveaway prize)',
            type: 'STRING',
            required: true
        }
    ],
    run: async({ interaction, client }) => {
        const query = interaction.options.getString('giveaway');

        // try to found the giveaway with prize then with ID
        const giveaway = 
            // Search with giveaway prize
            client.giveaways.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Search with giveaway ID
            client.giveaways.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // If no giveaway was found
        if (!giveaway) {
            return interaction.followUp({
                content: 'Unable to find a giveaway for `'+ query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.ended) {
            return interaction.followUp({
                content: 'This giveaway is already ended.',
                ephemeral: true
            });
        }

        // Edit the giveaway
        client.giveaways.end(giveaway.messageId)
        // Success message
        .then(() => {
            // Success message
            interaction.followUp('Giveaway ended!');
        })
        .catch((e) => {
            interaction.followUp({
                content: e,
                ephemeral: true
            });
        });
    }
});