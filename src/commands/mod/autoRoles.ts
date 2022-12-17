import { ApplicationCommandOptionType, Role } from "discord.js";
import guildSchema from "../../models/guildSchema";
import { Command } from "../../structures/Command";
import { createdBy } from "../../../assets/locale.json";
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
  name: "autoroles",
  description: "Manage the roles added on to a new member in this guild",
  userPermissions: ["ManageRoles"],
  options: [
    {
      name: "add",
      description: "Add an auto role",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "The role you want to add as an auto role",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove an auto role",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "The role you want to remove from the auto roles",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "list",
      description: "Shows the server auto-roles",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async ({ interaction, args }) => {
    const query = args.getSubcommand();
    const role = args.getRole("role");

    let guildData;
    try {
      guildData = await guildSchema.findOne({ serverID: interaction.guildId });
      if (!guildData) {
        let guild = await guildSchema.create({
          serverID: interaction.guildId,
          welcome: {
            enabled: false,
            channelID: "none",
            text: ":wave: Hello {member}, welcome to {guild}!",
          },
          logs: {
            enabled: false,
            channelID: "none",
          },
          tickets: {
            enabled: true,
            channelID: "none",
            categoryID: "none",
          },
          leveling: {
            enabled: true,
          },
          autoRoles: [],
          blacklist: [],
        });
        guild.save();
        guildData = await guildSchema.findOne({
          serverID: interaction.guildId,
        });
      }
    } catch (e) {
      console.error(e);
    }

    if (query === "add") {
      if ((guildData.autoRoles as string[]).includes(role.id))
        return interaction.reply({
          content: `The **${role.name}** has already been added as an auto role.`,
          ephemeral: true,
        });

      const response = await guildSchema.findOneAndUpdate(
        { serverID: interaction.guildId },
        {
          $push: {
            autoRoles: role.id,
          },
        }
      );
      return interaction.reply({
        content: `The **${role.name}** has been added as an autorole. Be sure that the auto role is higher than my role so I can add it to new members.`,
        ephemeral: true,
      });
    } else if (query === "remove") {
      if (!(guildData.autoRoles as string[]).includes(role.id))
        return interaction.reply({
          content: `The **${role.name}** role isn't an auto role in this guild.`,
          ephemeral: true,
        });

      const response = await guildSchema.findOneAndUpdate(
        { serverID: interaction.guildId },
        {
          $pull: {
            autoRoles: role.id,
          },
        }
      );
      return interaction.reply({
        content: `The **${role.name}** role has been removed from the auto roles.`,
        ephemeral: true,
      });
    } else if (query === "list") {
      let roles: Role[] = [];
      (guildData.autoRoles as string[]).forEach((roleID) => {
        const role = interaction.guild.roles.cache.get(roleID);
        if (role) {
          roles.push(role);
        }
      });
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new ExtendedEmbed()
            .setTitle(`${interaction.guild.name}'s auto roles`)
            .setDescription(
              "The followings are the roles added automatically when a member joins the server."
            )
            .addFields([
              {
                name: "Roles",
                value: `${
                  roles.length
                    ? roles.map((role) => `${role}`).join(", ")
                    : "No roles added"
                }`,
              },
            ])
            .setFooter({
              text: createdBy.text,
              iconURL: createdBy.icon,
            }),
        ],
      });
    }
  },
});
