import { Command } from "../../structures/Command";

export default new Command({
    name: "ping",
    description: "Gets the latency between the host and the Discord API",
    run: async ({ interaction, client }) => {
        interaction.reply(`**Discord API:** ${client.ws.ping}`);
    }
});
