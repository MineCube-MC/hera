import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'ping',
    description: 'Get the Discord API ping',
    async execute(interaction, client) {
        await interaction.reply({ content: ":ping_pong: Pinging...", ephemeral: true });
        interaction.editReply({ content: `**Discord API:** ${interaction.client.ws.ping}ms` });
    }
}