import { Command } from "../../structures/Command";
import { Country, getGames } from "epic-free-games/dist";
import { ExtendedEmbed } from "../../structures/Embed";
import { ApplicationCommandOptionType } from "discord.js";

const countries = [
  "TR",
  "US",
  "GB",
  "DE",
  "AR",
  "ES",
  "MX",
  "FR",
  "IT",
  "JP",
  "KR",
  "PL",
  "BR",
  "RU",
  "TH",
  "CN",
];
const countryChoices = [];
countries.forEach((country) => {
  countryChoices.push({
    name: country,
    value: country,
  });
});

export default new Command({
  name: "epicgames",
  description: "Check for free games on the Epic Games Store",
  options: [
    {
      name: "country",
      description: "The country you want to check for free games",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: countryChoices,
    },
  ],
  run: async ({ interaction, args }) => {
    const country = args.getString("country");
    const games = await getGames(country as Country, true);
    const gameEmbed = new ExtendedEmbed()
      .setTitle(games.currentGames[0].title)
      .setDescription(games.currentGames[0].description)
      .setThumbnail(games.currentGames[0].keyImages[0].url);
    if (games.currentGames[0].url)
      gameEmbed.setURL(games.currentGames[0].urlSlug);
    interaction.reply({ embeds: [gameEmbed] });
  },
});
