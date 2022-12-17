import {
  ChannelType,
  CommandInteractionOptionResolver,
  GuildMember,
  PermissionResolvable,
} from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";
import guildSchema from "../models/guildSchema";

export default new Event("interactionCreate", async (interaction) => {
  // Chat Input Commands
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      if (process.env.guildId) {
        client.guilds.cache
          .get(process.env.guildId)
          .commands.cache.delete(interaction.commandId);
      } else {
        client.commands.delete(interaction.commandId);
      }
      return interaction.reply({
        content: `The \`${interaction.commandName}\` command doesn't exist.`,
        ephemeral: true,
      });
    }

    let permissionsNeeded: PermissionResolvable[] = command.userPermissions
      ?.length
      ? command.userPermissions
      : [];
    if (
      (interaction as ExtendedInteraction).memberPermissions.has([
        permissionsNeeded,
      ])
    ) {
      command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction,
      });
    } else
      return interaction.reply({
        content: `You're missing the following permissions: ${permissionsNeeded
          .map((permission) => `\`${permission}\``)
          .join(", ")}`,
        ephemeral: true,
      });
  }
  // Listening to buttons
  if (interaction.isButton()) {
    // Listening to button roles
    if (interaction.customId.includes("role")) {
      const roleID = interaction.customId.replace(/[^0-9]/g, "");
      const member = interaction.member as GuildMember;

      if (interaction.guild.roles.cache.find((role) => role.id === roleID)) {
        const role = interaction.guild.roles.cache.get(roleID);
        if (!interaction.guild.members.me.permissions.has("ManageRoles"))
          return interaction.reply({
            content: `I'm missing the permission to manage roles in this guild. Contact the server administrator.`,
            ephemeral: true,
          });
        if (
          role.position >= interaction.guild.members.me.roles.highest.position
        )
          return interaction.reply({
            content: `I can't assign/remove you this role because my highest role is below this role. Contact the server administrator.`,
            ephemeral: true,
          });
        if (member.roles.cache.some((role) => role.id === roleID)) {
          member.roles.remove(role);
          return interaction.reply({
            content: `You've been removed the **${role.name}** role.`,
            ephemeral: true,
          });
        } else {
          member.roles.add(role);
          return interaction.reply({
            content: `You've been added the **${role.name}** role.`,
            ephemeral: true,
          });
        }
      } else {
        return interaction.reply({
          content: `This role doesn't exist, try contacting the server administrator.`,
          ephemeral: true,
        });
      }
    } else if (interaction.customId.includes("tickets")) {
      const serverID = interaction.guildId;
      const guild = client.guilds.cache.get(serverID);
      const member = interaction.member as GuildMember;
      let guildData;
      try {
        guildData = await guildSchema.findOne({ serverID: guild.id });
        if (!guildData) {
          let guildCollection = new guildSchema({
            serverID: guild.id,
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
          await guildCollection.save();
          guildData = await guildSchema.findOne({ serverID: guild.id });
        }
      } catch (e) {
        console.error(e);
      }
      if (guildData.tickets.enabled) {
        if (!interaction.guild.members.me.permissions.has("ManageChannels"))
          return interaction.reply({
            content: `I'm missing the permission to manage channels in this guild. Contact the server administrator.`,
            ephemeral: true,
          });
        if (!interaction.guild.members.me.permissions.has("ManageRoles"))
          return interaction.reply({
            content: `I'm missing the permission to manage roles in this guild. Contact the server administrator.`,
            ephemeral: true,
          });
        if (!interaction.guild.members.me.permissions.has("ManageMessages"))
          return interaction.reply({
            content: `I'm missing the permission to manage messages in this guild. Contact the server administrator.`,
            ephemeral: true,
          });
        if (!interaction.guild.members.me.permissions.has("AddReactions"))
          return interaction.reply({
            content: `I'm missing the permission to add reactions in this guild. Contact the server administrator.`,
            ephemeral: true,
          });

        const ticketCategory = guild.channels.cache.get(
          guildData.tickets.categoryID
        );
        const ticketChannel = guild.channels.cache.get(
          guildData.tickets.channelID
        );
        if (ticketCategory && ticketChannel) {
          if (
            ticketCategory.type === ChannelType.GuildCategory &&
            ticketChannel.type === ChannelType.GuildText
          ) {
            const ticket = await guild.channels.create({
              name: `ticket-${member.user.username}`,
              type: ChannelType.GuildText,
              parent: ticketCategory,
              permissionOverwrites: [
                {
                  id: member.id,
                  allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
                },
                {
                  id: guild.roles.everyone,
                  deny: ["ViewChannel"],
                },
                {
                  id: guild.members.me.id,
                  allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
                },
              ],
            });
            ticket.send({
              content: `Hello ${member}, welcome to your ticket. Please explain your problem and a staff member will help you as soon as possible.`,
            });
            interaction.reply({
              content: `Your ticket has been created in ${ticket}`,
              ephemeral: true,
            });
          } else {
            return interaction.reply({
              content: `The ticket category or channel doesn't exist, try contacting the server administrator.`,
              ephemeral: true,
            });
          }
        } else {
          return interaction.reply({
            content: `The ticket category or channel doesn't exist, try contacting the server administrator.`,
            ephemeral: true,
          });
        }
      } else {
        return interaction.reply({
          content: `Tickets are disabled in this server, try contacting the server administrator.`,
          ephemeral: true,
        });
      }
    }
  }
});
