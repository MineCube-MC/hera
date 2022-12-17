import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "rerollgiveaway",
  description: "Reroll an existing giveaway",
  userPermissions: ["ManageEvents", "ModerateMembers", "ManageMessages"],
  options: [
    {
      name: "giveaway",
      description: "The giveaway to reroll (message ID or giveaway prize)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ client, interaction, args }) => {
    const query = args.getString("giveaway");

    const giveaway =
      client.giveaways.giveaways.find(
        (g) => g.prize === query && g.guildId === interaction.guild.id
      ) ||
      client.giveaways.giveaways.find(
        (g) => g.messageId === query && g.guildId === interaction.guild.id
      );

    if (!giveaway) {
      return interaction.reply({
        content: "Unable to find a giveaway for `" + query + "`.",
        ephemeral: true,
      });
    }

    if (!giveaway.ended) {
      return interaction.reply({
        content: "The giveaway is not ended yet.",
        ephemeral: true,
      });
    }

    client.giveaways
      .reroll(giveaway.messageId)
      .then(() => {
        interaction.reply("Giveaway rerolled!");
      })
      .catch((e) => {
        interaction.reply({
          content: e,
          ephemeral: true,
        });
      });
  },
});
