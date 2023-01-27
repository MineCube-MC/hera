import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/Command";
import { MusicEmbed } from "../../structures/Embed";

// Credit to Kaj on YouTube for the music system code

export default new Command({
  name: "music",
  description: "Play music in your voice channel",
  options: [
    {
      name: "play",
      description: "Play a song",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "query",
          type: ApplicationCommandOptionType.String,
          required: true,
          description: "The name or URL of the song",
        },
      ],
    },
    {
      name: "volume",
      description: "Change the volume of the music player",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "percent",
          description: "The volume percentage without the % (1-100)",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
          max_value: 100,
        },
      ],
    },
    {
      name: "options",
      description: "Change the music player options",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "option",
          description: "The option you want to change",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: "loop", value: "loop" },
            { name: "queue", value: "queue" },
            { name: "skip", value: "skip" },
            { name: "pause", value: "pause" },
            { name: "resume", value: "resume" },
            { name: "stop", value: "stop" },
          ],
        },
      ],
    },
  ],
  run: async ({ interaction, args, client }) => {
    const { member, guild, channel } = interaction;

    const subcommand = args.getSubcommand();
    const query = args.getString("query");
    const volume = args.getInteger("percent");
    const option = args.getString("option");
    const voiceChannel = member.voice.channel;

    const embed = new MusicEmbed();

    if (!voiceChannel) {
      embed
        .setColor("Red")
        .setDescription(
          "You need to be in a voice channel to use this command"
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    /* if (!(member.voice.channelId == guild.members.me.voice.channelId)) {
      embed
        .setColor("Red")
        .setDescription(
          "You can't use the music player as it is already active in another voice channel"
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    } */

    try {
      switch (subcommand) {
        case "play":
          client.distube.play(voiceChannel, query, {
            textChannel: channel,
            member: member,
          });
          return interaction.reply({
            content: `🎶 Searching \`${query}\`...`,
          });
        case "volume":
          client.distube.setVolume(voiceChannel, volume);
          return interaction.reply({
            content: `🔊 Volume set to ${volume}%`,
          });
        case "options":
          const queue = await client.distube.getQueue(voiceChannel);

          if (!queue) {
            embed.setColor("Red").setDescription("There is no active queue.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          switch (option) {
            case "loop":
              queue.setRepeatMode();
              embed
                .setColor("Purple")
                .setDescription(
                  `🔁 Looping has been ${
                    queue.repeatMode == 1 ? "enabled" : "disabled"
                  }`
                );
              return interaction.reply({ embeds: [embed], ephemeral: true });
            case "skip":
              await queue.skip();
              embed
                .setColor("Blue")
                .setDescription("⏩ The song has been skipped.");
              return interaction.reply({ embeds: [embed], ephemeral: true });
            case "stop":
              await queue.stop();
              embed
                .setColor("Red")
                .setDescription("⏹️ The song has been stopped.");
              return interaction.reply({ embeds: [embed], ephemeral: true });
            case "pause":
              queue.pause();
              embed
                .setColor("Orange")
                .setDescription("⏸️ The song has been paused.");
              return interaction.reply({ embeds: [embed], ephemeral: true });
            case "resume":
              queue.resume();
              embed
                .setColor("Green")
                .setDescription("▶️ The song has been resumed.");
              return interaction.reply({ embeds: [embed], ephemeral: true });
            case "queue":
              embed
                .setColor("Purple")
                .setDescription(
                  `${queue.songs.map(
                    (song, id) =>
                      `\n**${id + 1}**. ${song.name} - \`${
                        song.formattedDuration
                      }\``
                  )}`
                );
              return interaction.reply({ embeds: [embed], ephemeral: true });
          }
      }
    } catch (e) {
      console.error(e);
      embed.setColor("Red").setDescription("`⛔ | An error occurred...`");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
});
