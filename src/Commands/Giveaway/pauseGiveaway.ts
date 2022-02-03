import { Command } from "../../Interfaces";

export const command: Command = {
    name: 'pausegiveaway',
    description: 'Pause or unpause a giveaway',
    options: [
        {
            name: 'giveaway',
            description: 'The giveaway to pause or unpause (message ID or giveaway prize)',
            type: 'STRING',
            required: true
        }
    ],
    async execute(interaction, client) {
        if(!interaction.memberPermissions.has('ADMINISTRATOR')) return interaction.reply({ content: `The \`ADMINISTRATOR\` permission is needed to execute this command!`, ephemeral: true});
        
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
                content: 'Unable to find a giveaway for `'+ query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.pauseOptions.isPaused) {
            return client.giveaways.unpause(giveaway.messageId)
            // Success message
            .then(() => {
                // Success message
                interaction.reply('Giveaway unpaused!');
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });
        }

        // Edit the giveaway
        client.giveaways.pause(giveaway.messageId, {
            isPaused: true,
            content: '⚠️ **THIS GIVEAWAY IS PAUSED !** ⚠️',
            unPauseAfter: null,
            embedColor: '#FFFF00'
        })
        // Success message
        .then(() => {
            // Success message
            interaction.reply('Giveaway paused!');
        })
        .catch((e) => {
            interaction.reply({
                content: e,
                ephemeral: true
            });
        });
    }
}