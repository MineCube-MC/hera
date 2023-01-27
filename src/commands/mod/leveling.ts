import { ApplicationCommandOptionType } from "discord.js";
import guildSchema from "../../models/guildSchema";
import { Command } from "../../structures/Command";

export default new Command({
  name: "leveling",
  description: "Enable or disable leveling in the server",
  userPermissions: ["ManageGuild"],
  options: [
    {
      name: "enable",
      description: "Enable leveling in the server",
      type: ApplicationCommandOptionType.Boolean,
      required: true,
    },
  ],
  run: async ({ interaction, args, client }) => {
    const { member } = interaction;
    let guildData;
    try {
      guildData = await guildSchema.findOne({ serverID: member.guild.id });
      if (!guildData) {
        let guild = await guildSchema.create({
          serverID: member.guild.id,
          welcome: {
            enabled: false,
            channelID: "none",
            text: ":wave: Hello {member}, welcome to {guild}!",
          },
          logs: {
            enabled: false,
            channelID: "none",
          },
          leveling: {
            enabled: true,
          },
          autoRoles: [],
          blacklist: [],
        });
        guild.save();
        guildData = await guildSchema.findOne({ serverID: member.guild.id });
      }
    } catch (e) {
      console.error(e);
    }

    const enable = args.getBoolean("enable");
    const response = await guildSchema.findOneAndUpdate(
      {
        serverID: member.guild.id,
      },
      {
        $set: {
          leveling: {
            enabled: enable,
          },
        },
      }
    );

    return interaction.reply({
      content: `Leveling has been ${
        enable ? "enabled" : "disabled"
      } in the server`,
      ephemeral: true,
    });
  },
});
