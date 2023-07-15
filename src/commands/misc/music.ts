import { ApplicationCommandOptionType } from "discord.js"
import { Command } from "../../structures/Command"
import { MusicEmbed } from "../../structures/Embed"
import { client } from '../..'
import { MoonlinkQueue } from 'moonlink.js'

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
      name: "queue",
      description: "See what's in the current queue",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "skip",
      description: "Skip the current song",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "stop",
      description: "Stop the queue and disconnect the bot from your voice channel",
      type: ApplicationCommandOptionType.Subcommand,
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
            { name: "pause", value: "pause" },
            { name: "resume", value: "resume" },
          ],
        },
      ],
    },
  ],
  run: async ({ interaction, args, client }) => {
    const { member, guild, channel } = interaction

    const subcommand = args.getSubcommand()
    const query = args.getString("query")
    const volume = args.getInteger("percent")
    const option = args.getString("option")
    const voiceChannel = member.voice.channel

    const embed = new MusicEmbed()

    if (!voiceChannel) {
      embed
        .setColor("Red")
        .setDescription(
          ":warning: | You need to be in a voice channel to use this command"
        )
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if (guild.members.me.voice.channel) {
      if (guild.members.me.voice.channel.id !== voiceChannel.id) {
        embed
          .setColor("Red")
          .setDescription(
            ":warning: | You need to be in the same voice channel as me to use this command"
          )
        return interaction.reply({
          embeds: [embed],
          ephemeral: true,
        })
      }
    }

    let player = client.moon.players.create({
      guildId: interaction.guild.id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
      autoPlay: true
    })

    try {
      switch (subcommand) {
        case "play":
          if (!player.connected) player.connect({
            setDeaf: true,
            setMute: false
          })
          let res = await client.moon.search(query)
          client.moon.spotify.check(query)
          if (res.loadType === 'error') {
            return interaction.reply({
              content: `⛔ | Load failed.`
            })
          } else if (res.loadType === "empty") {
            return interaction.reply({
              content: `⛔ | No matches!`
            }) // nothing was found
          }
          if (res.loadType === 'playlist') {
            embed
              .setColor("Green")
              .setDescription(`🎶 | Added \`${res.playlistInfo.name}\`\nRequested by: <@${interaction.user.id}>`)
            interaction.reply({
              embeds: [embed]
            })
            for (const track of res.tracks) {
              player.queue.add(track)
            }
          } else {
            let formattedDuration: string
            let seconds = toInt32(res.tracks[0].duration / 1000)
            let minutes = toInt32(seconds / 60)
            let secondsFormatted = toInt32(seconds % 60)
            if (minutes > 0) {
              formattedDuration = `${separateDigits(minutes).length === 1 ? "0" : ""}${minutes}:${separateDigits(secondsFormatted).length === 1 ? "0" : ""}${secondsFormatted}`
            } else {
              formattedDuration = seconds + seconds > 1 ? " seconds" : " second"
            }
            player.queue.add(res.tracks[0])
            embed.setColor("Green")
              .setDescription(`🎶 | Added \`${res.tracks[0].title}\` - \`${formattedDuration
                }\`\nRequested by: <@${interaction.user.id}>`)
              .setThumbnail(res.tracks[0].artworkUrl)
            interaction.reply({
              embeds: [embed]
            })
          }
          if (!player.playing) player.play()
          break
        case "stop":
          if (player.connected) {
            embed
              .setColor("Blue")
              .setDescription(":firecracker: | Player destroyed!")
            player.destroy().then(status => {
              if (status)
                interaction.reply({
                  embeds: [embed]
                })
              else {
                embed
                  .setColor("Red")
                  .setDescription("⛔ | There's an opposing force that doesn't let the player to be destroyed, can you find it?")
                interaction.reply({ embeds: [embed] })
              }
            })
          } else {
            embed
              .setColor("Red")
              .setDescription("⛔ | There is no active queue.")
            interaction.reply({
              embeds: [embed],
              ephemeral: true
            })
          }
          break
        case "skip":
          if (!player.connected) {
            embed
              .setColor("Red")
              .setDescription("⛔ | There is no active queue.")
            return interaction.reply({
              embeds: [embed],
              ephemeral: true
            })
          }
          player.skip()
          let formattedDuration: string
          let seconds = toInt32(player.current.duration / 1000)
          let minutes = toInt32(seconds / 60)
          let secondsFormatted = toInt32(seconds % 60)
          if (minutes > 0) {
            formattedDuration = `${separateDigits(minutes).length === 1 ? "0" : ""}${minutes}:${separateDigits(secondsFormatted).length === 1 ? "0" : ""}${secondsFormatted}`
          } else {
            formattedDuration = seconds + seconds > 1 ? " seconds" : " second"
          }
          embed.setColor("Blue")
            .setDescription(`🎶 | Now playing \`${player.current.title}\` - \`${formattedDuration
              }\`\nSkipped by: <@${interaction.user.id}>`)
            .setThumbnail(player.current.artworkUrl)
          interaction.reply({
            embeds: [embed]
          })
          break
        case "options":
          if (!player.connected) {
            embed.setColor("Red").setDescription("⛔ | There is no active queue.")
            return interaction.reply({ embeds: [embed], ephemeral: true })
          }

          switch (option) {
            case "loop":
              embed.setColor("Purple")
              if (player.loop == 1) {
                player.setLoop(0)
                embed.setDescription(`🔁 Looping has been disabled`)
              } else {
                player.setLoop(1)
                embed.setDescription(`🔁 Looping has been enabled`)
              }
              return interaction.reply({ embeds: [embed], ephemeral: true })
            case "pause":
              if (player.paused) return interaction.reply({
                embeds: [
                  embed
                    .setColor("Red")
                    .setDescription("⛔ | The player is already paused")
                ],
                ephemeral: true
              })
              player.pause()
              embed
                .setColor("Orange")
                .setDescription("⏸️ The player has been paused.")
              return interaction.reply({ embeds: [embed], ephemeral: true })
            case "resume":
              if (!player.paused) return interaction.reply({
                embeds: [
                  embed
                    .setColor("Red")
                    .setDescription("⛔ | The player is already resumed")
                ],
                ephemeral: true
              })
              player.resume()
              embed
                .setColor("Green")
                .setDescription("▶️ The song has been resumed.")
              return interaction.reply({ embeds: [embed], ephemeral: true })
          }
          break
      }
    } catch (e) {
      console.error(e)
      embed.setColor("Red").setDescription("`⛔ | An error occurred...`")
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }
  },
})

type Int = number & { __int__: void }

function separateDigits(num: number): number[] {
  let arr: number[] = []
  let lastDigit: number

  num = toInt32(num)

  do {
    lastDigit = num % 10
    arr.push(lastDigit)
    // Updating num to num/10 cuts off the last digit:
    num = toInt32(num / 10)
  }
  while (num !== 0)

  return arr.reverse()
}

function toInt32(f: number): number {
  // Note that type "number" in JS is always "float" internally.
  return f >> 0
}