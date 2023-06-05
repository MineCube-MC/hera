import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";
import locale from "../../../assets/locale.json"

export default new Command({
  name: "about",
  description: "Tells more about the bot",
  run: async ({ interaction, client }) => {
    const aboutEmbed = new ExtendedEmbed()
      .setTitle(`${locale.title}`)
      .setDescription(locale.description)
      .addFields([
        {
          name: "Features",
          value: `${locale.features.description}\n${locale.features.commands}\n${locale.features.giveawayCommands}\n${locale.features.musicCommands}`,
        },
        {
          name: "Credits",
          value: `${locale.credits.description}\n${locale.credits.discordjs}\n${locale.credits.reconlx}`,
        },
        {
          name: "Links",
          value: `${locale.links.server} | ${locale.links.bot} | ${locale.links.github}`,
        },
      ])
      .setFooter({
        text: locale.createdBy.text,
        iconURL: locale.createdBy.icon,
      })
      .setThumbnail(client.user.displayAvatarURL());
    interaction.reply({
      embeds: [aboutEmbed],
    });
  },
});
