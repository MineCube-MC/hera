import {
  ApplicationCommandDataResolvable,
  BaseGuildTextChannel,
  BaseGuildVoiceChannel,
  Client,
  ClientEvents,
  Collection,
  EmbedBuilder,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import { CommandType, ExtendedInteraction } from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";
import Levels from "discord-xp";
import { GiveawaysManager } from "discord-giveaways";
import mongoose, { connect } from "mongoose";
import { MusicEmbed } from "./Embed";
import {
  DiscordActivityType,
  DiscordActivityValues,
} from "../typings/Activity";
import { DisTube } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import axios from "axios";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  privateCommands: Collection<string, CommandType> = new Collection();
  sweepMessages = this.sweepers.sweepMessages;
  giveaways: GiveawaysManager;
  distube: DisTube;

  constructor() {
    super({ intents: 98303 });
  }

  async start() {
    mongoose.set("strictQuery", true);
    await connect(
      process.env.mongoUri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log("Database connected");
      }
    );

    this.registerModules();
    this.login(process.env.botToken);

    this.on("ready", () => {});

    this.distube = new DisTube(this, {
      leaveOnStop: true,
      emitNewSongOnly: true,
      emitAddSongWhenCreatingQueue: false,
      emitAddListWhenCreatingQueue: false,

      plugins: [
        new SpotifyPlugin({
          emitEventsAfterFetching: true,
        }),
        new SoundCloudPlugin(),
      ],
    });

    // On bot disconnect, stop the music
    this.on("voiceStateUpdate", (oldState, newState) => {
      if (
        oldState.member?.id === this.user?.id &&
        oldState.channel?.members.size === 1
      ) {
        const queue = this.distube.getQueue(oldState.guild.id);
        if (queue) queue.stop();
      }
    });

    const status = (queue) =>
      `Volume: \`${queue.volume}%\` | Filter: \`${
        queue.filters.names.join(", ") || "Off"
      }\` | Loop: \`${
        queue.repeatMode
          ? queue.repeatMode === 2
            ? "All Queue"
            : "This Song"
          : "Off"
      }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
    this.distube
      .on("disconnect", (queue) => {
        queue.stop();
      })
      .on("playSong", (queue, song) => {
        if (
          queue.textChannel instanceof BaseGuildTextChannel ||
          queue.textChannel instanceof VoiceChannel
        ) {
          queue.textChannel.send({
            embeds: [
              new MusicEmbed()
                .setColor("Green")
                .setDescription(
                  `🎶 | Playing \`${song.name}\` - \`${
                    song.formattedDuration
                  }\`\nRequested by: ${song.user}\n${status(queue)}`
                )
                .setThumbnail(song.thumbnail),
            ],
          });
        }
      })
      .on("addSong", (queue, song) => {
        if (
          queue.textChannel instanceof BaseGuildTextChannel ||
          queue.textChannel instanceof VoiceChannel
        ) {
          queue.textChannel.send({
            embeds: [
              new MusicEmbed()
                .setColor("Green")
                .setDescription(
                  `🎶 | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
                )
                .setThumbnail(song.thumbnail),
            ],
          });
        }
      })
      .on("addList", (queue, playlist) => {
        if (
          queue.textChannel instanceof BaseGuildTextChannel ||
          queue.textChannel instanceof VoiceChannel
        )
          queue.textChannel.send({
            embeds: [
              new MusicEmbed()
                .setColor("Green")
                .setDescription(
                  `🎶 | Added \`${playlist.name}\` playlist (${
                    playlist.songs.length
                  } songs) to queue\n${status(queue)}`
                )
                .setThumbnail(playlist.thumbnail),
            ],
          });
      })
      .on("error", (channel, e) => {
        if (channel && channel instanceof BaseGuildTextChannel)
          channel.send(
            `⛔ | An error encountered: ${e.toString().slice(0, 1974)}`
          );
        else console.error(e);
      })
      .on("empty", (queue) => {
        if (
          queue.textChannel instanceof BaseGuildTextChannel ||
          queue.textChannel instanceof VoiceChannel
        )
          queue.textChannel.send({
            embeds: [
              new MusicEmbed()
                .setColor("Red")
                .setDescription(
                  "⛔ | Voice channel is empty! Leaving the channel..."
                ),
            ],
          });
      })
      .on("searchNoResult", (message, query) => {
        if (message.channel instanceof BaseGuildTextChannel)
          message.channel.send({
            embeds: [
              new MusicEmbed()
                .setColor("Red")
                .setDescription(`⛔ | No result found for \`${query}\`!`),
            ],
          });
      })
      .on("finish", (queue) => {
        if (
          queue.textChannel instanceof BaseGuildTextChannel ||
          queue.textChannel instanceof VoiceChannel
        )
          queue.textChannel.send({
            embeds: [
              new MusicEmbed()
                .setColor("Green")
                .setDescription("🏁 | Queue finished!"),
            ],
          });
      });
  }

  async createTogetherCode(
    voiceChannelId: string,
    option: DiscordActivityType
  ) {
    /**
     * @param {string} code The invite link (only use the blue link)
     */
    let returnData = {
      code: "none",
    };
    if (option && DiscordActivityValues[option.toLowerCase()]) {
      let applicationID = DiscordActivityValues[option.toLowerCase()];
      try {
        const response = await axios.post(
          `https://discord.com/api/v10/channels/${voiceChannelId}/invites`,
          JSON.stringify({
            max_age: 86400,
            max_uses: 0,
            target_application_id: applicationID,
            target_type: 2,
            temporary: false,
            validate: null,
          }),
          {
            headers: {
              Authorization: `Bot ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.error || !response.data.code)
          throw new Error("An error occured while retrieving data!");
        if (Number(response.data.code) === 50013)
          console.warn(
            "The bot lacks permissions to generate the activity code."
          );
        returnData.code = response.data.code;
      } catch (err) {
        throw new Error(
          "An error occured while starting the Discord Activity!"
        );
      }
      return returnData;
    } else {
      throw new SyntaxError("Invalid option!");
    }
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId) {
      if (
        process.env.environment === "dev" ||
        process.env.environment === "debug"
      ) {
        this.guilds.cache.get(guildId)?.commands.set(commands);
        console.log(
          `Registering commands to ${this.guilds.cache.get(guildId).name}`
        );
      } else {
        this.application?.commands.set(commands);
        console.log("Registering global commands");
      }
    } else {
      this.application?.commands.set(commands);
      console.log("Registering global commands");
    }
  }

  async registerModules() {
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`
    );
    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath);
      if (!command.name) return;
      if (process.env.environment === "debug") console.log(command);

      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    const privateSlashCommands: ApplicationCommandDataResolvable[] = [];
    const privateCommandFiles = await globPromise(
      `${__dirname}/../modules/*/*{.ts,.js}`
    );
    privateCommandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath);
      if (!command.name) return;
      if (process.env.environment === "debug") console.log(command);

      this.privateCommands.set(command.name, command);
      privateSlashCommands.push(command);
    });

    this.on("ready", () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.guildId,
      });
    });

    // Event
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    });

    // Leveling
    Levels.setURL(process.env.mongoUri);

    // Giveaways
    this.giveaways = new GiveawaysManager(this, {
      storage: "./giveaways.json",
      default: {
        botsCanWin: false,
        embedColor: "Blurple",
        embedColorEnd: "DarkRed",
        reaction: "🎉",
      },
    });
  }
}
