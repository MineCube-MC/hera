import {
  ApplicationCommandOptionType,
  ChannelType,
  TextChannel,
} from "discord.js";
import { Command } from "../../structures/Command";
import ms from "ms";

export default new Command({
  name: "giveaway",
  description: "Start a new giveaway in this guild",
  userPermissions: ["ManageEvents", "ModerateMembers", "ManageMessages"],
  options: [
    {
      name: "normal",
      description: "Start a new giveaway in this guild",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "duration",
          description:
            "How long the giveaway should last for. Example values: 1m, 1h, 1d",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "winners",
          description: "How many winners the giveaway should have",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "prize",
          description: "What the prize of the giveaway should be",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "channel",
          description: "The channel to start the giveaway in",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
    {
      name: "drop",
      description: "Start a new drop giveaway in this guild",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "winners",
          description: "How many winners the giveaway should have",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "prize",
          description: "What the prize of the giveaway should be",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "channel",
          description: "The channel to start the giveaway in",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
  ],
  run: async ({ client, interaction, args }) => {
    const giveawayChannel = args.getChannel("channel");
    const giveawayDuration = args.getString("duration");
    const giveawayWinnerCount = args.getInteger("winners");
    const giveawayPrize = args.getString("prize");

    if (
      ((giveawayChannel): giveawayChannel is TextChannel =>
        giveawayChannel.type === ChannelType.GuildText ||
        giveawayChannel.type === ChannelType.GuildNews)(giveawayChannel)
    ) {
      if (args.getSubcommand() !== "drop") {
        client.giveaways.start(giveawayChannel, {
          duration: ms(giveawayDuration),
          prize: giveawayPrize,
          winnerCount: giveawayWinnerCount,
          hostedBy: interaction.user,
        });
      } else {
        client.giveaways.start(giveawayChannel, {
          winnerCount: giveawayWinnerCount,
          prize: giveawayPrize,
          hostedBy: interaction.user,
          isDrop: true,
        });
      }

      interaction.reply({
        content: `Giveaway started in ${giveawayChannel}!`,
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        content: "Selected channel is not text-based.",
        ephemeral: true,
      });
    }
  },
});
