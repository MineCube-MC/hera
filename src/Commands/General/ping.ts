import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'ping',
    type: 'bot',
    category: 'General',
    run: async(client, args, interaction) => {
        const msg = await interaction.reply({ content: ":ping_pong: Pinging...", ephemeral: true });
        interaction.editReply({ content: `**Discord API:** ${client.ws.ping}ms\n**Message:** ${interaction.createdTimestamp - interaction.createdTimestamp}ms` });
    }
}