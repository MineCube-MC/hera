import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection
} from "discord.js";
import { CommandType } from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";
import Levels from "discord-xp";
import { DiscordTogether } from "discord-together";
import { GiveawaysManager } from "discord-giveaways";
import { connect } from "mongoose";
import { API } from "./API";
import { Player } from "discord-player";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    activities = new DiscordTogether(this);
    giveaways: GiveawaysManager;
    player: Player;
    public static client = this;

    constructor() {
        super({ intents: 32767 });
    }

    async start() {
        await connect(process.env.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => {
            console.log("Database connected");
        });

        this.registerModules();
        this.login(process.env.botToken);

        this.on("ready", () => new API(this).start(process.env.port));

        this.player = new Player(this, {
            ytdlOptions: {
                quality: "highestaudio",
                highWaterMark: 1 << 25
            }
        });

        this.player.on("error", (err) => {
            if(process.env.environment === "dev" || process.env.environment === "debug") {
                console.error(err);
            }
        });
    }
    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            if(process.env.environment === "dev" || process.env.environment === "debug") {
                this.guilds.cache.get(guildId)?.commands.set(commands);
                console.log(`Registering commands to ${this.guilds.cache.get(guildId).name}`);
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
            if (process.env.enviroment === "debug") console.log(command);

            this.commands.set(command.name, command);
            slashCommands.push(command);
        });

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId
            });
        });

        // Event
        const eventFiles = await globPromise(
            `${__dirname}/../events/*{.ts,.js}`
        );
        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(
                filePath
            );
            this.on(event.event, event.run);
        });

        // Leveling
        Levels.setURL(process.env.mongoUri);

        // Giveaways
        this.giveaways = new GiveawaysManager(this, {
            storage: "./giveaways.json",
            default: {
                botsCanWin: false,
                embedColor: "BLURPLE",
                embedColorEnd: "DARK_RED",
                reaction: '🎉'
            }
        });
    }
}
