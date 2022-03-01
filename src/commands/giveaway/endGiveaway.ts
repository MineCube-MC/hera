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

        client.giveaways.end(giveaway.messageId)
        .then(() => {
            interaction.reply('Giveaway ended!');
        })
        .catch((e) => {
            interaction.reply({
                content: e,
                ephemeral: true
            });
        });
    }
});