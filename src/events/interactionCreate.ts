import {
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  CommandInteractionOptionResolver,
  GuildMember,
  PermissionResolvable,
  TextChannel,
} from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";

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
});
