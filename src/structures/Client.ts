import {
  ApplicationCommandDataResolvable,
  BaseGuildTextChannel,
  Client,
  ClientEvents,
  Collection,
  VoiceChannel,
} from "discord.js"
import { CommandType } from "../typings/Command"
import { RegisterCommandsOptions } from "../typings/client"
import { Event } from "./Event"
import { GiveawaysManager } from "discord-giveaways"
import { MusicEmbed } from "./Embed"
import globPromise from "glob-promise"
import { MoonlinkManager } from 'moonlink.js'

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection()
  privateCommands: Collection<string, CommandType> = new Collection()
  sweepMessages = this.sweepers.sweepMessages
  giveaways: GiveawaysManager
  moon: MoonlinkManager

  constructor() { super({ intents: 98303 }) }

  async start() {
    this.registerModules()
    this.login(process.env.botToken)

    this.on("ready", () => {
      this.moon.init(this.user.id)
    })

    this.on('raw', (data) => {
      this.moon.packetUpdate(data)
    })

    this.moon = new MoonlinkManager(
      [{ host: process.env.lavalinkHost, port: 2333, password: "youshallnotpass" }],
      {},
      (guild, sPayload) => {
        this.guilds.cache.get(guild).shard.send(JSON.parse(sPayload))
      }
    )

    this.moon.on('nodeCreate', () => {
      console.log(`Lavalink node was connected`)
    })

    this.moon.on('nodeError', (node, err) => {
      console.error(err)
    })
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId) {
      if (
        process.env.environment === "dev" ||
        process.env.environment === "debug"
      ) {
        this.guilds.cache.get(guildId)?.commands.set(commands)
        console.log(
          `Registering commands to ${this.guilds.cache.get(guildId).name}`
        )
      } else {
        this.application?.commands.set(commands)
        console.log("Registering global commands")
      }
    } else {
      this.application?.commands.set(commands)
      console.log("Registering global commands")
    }
  }

  async registerModules() {
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] = []
    const commandFiles = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`
    )
    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath)
      if (!command.name) return
      if (process.env.environment === "debug") console.log(command)

      this.commands.set(command.name, command)
      slashCommands.push(command)
    })

    const privateSlashCommands: ApplicationCommandDataResolvable[] = []
    const privateCommandFiles = await globPromise(
      `${__dirname}/../modules/*/*{.ts,.js}`
    )
    privateCommandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath)
      if (!command.name) return
      if (process.env.environment === "debug") console.log(command)

      this.privateCommands.set(command.name, command)
      privateSlashCommands.push(command)
    })

    this.on("ready", () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.guildId,
      })
    })

    // Event
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath)
      this.on(event.event, event.run)
    })

    // Giveaways
    this.giveaways = new GiveawaysManager(this, {
      storage: "./giveaways.json",
      default: {
        botsCanWin: false,
        embedColor: "Blurple",
        embedColorEnd: "DarkRed",
        reaction: "🎉",
      },
    })
  }
}
