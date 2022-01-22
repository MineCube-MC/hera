import { Command } from "../../structures/Command";

export default new Command({
    name: "rerollgiveaway",
    description: "Reroll an existing giveaway",
    userPermissions: ["MANAGE_EVENTS", "MODERATE_MEMBERS", "MANAGE_MESSAGES"],
    options: [
        {
            name: 'giveaway',
            description: 'The giveaway to reroll (message ID or giveaway prize)',
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
            return interaction.reply({
                content: 'Unable to find a giveaway for `'+ query +'`.',
                ephemeral: true
            });
        }

        if (!giveaway.ended) {
            return interaction.reply({
                content: 'The giveaway is not ended yet.',
                ephemeral: true
            });
        }

        // Reroll the giveaway
        client.giveaways.reroll(giveaway.messageId)
        .then(() => {
            // Success message
            interaction.reply('Giveaway rerolled!');
        })
        .catch((e) => {
            interaction.reply({
                content: e,
                ephemeral: true
            });
        });
    }
});