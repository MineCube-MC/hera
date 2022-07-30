import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection
} from "discord.js";
import { CommandType, ExtendedInteraction } from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";
import Levels from "discord-xp";
import { GiveawaysManager } from "discord-giveaways";
import { connect } from "mongoose";
import { API } from "./API";
import { Player } from "discord-player";
import { MusicEmbed } from "./Embed";
import { WebSocket } from "./WebSocket";
import { DiscordActivityType } from "../typings/Activity";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    privateCommands: Collection<string, CommandType> = new Collection();
    sweepMessages = this.sweepers.sweepMessages;
    giveaways: GiveawaysManager;
    player: Player;

    activities = {
        list: {
            youtube: '880218394199220334',
            youtubedev: '880218832743055411',
            betrayal: '773336526917861400',
            fishing: '814288819477020702',
            chess: '832012774040141894',
            chessdev: '832012586023256104',
            lettertile: '879863686565621790',
            wordsnack: '879863976006127627',
            awkword: '879863881349087252',
            spellcast: '852509694341283871',
            checkers: '832013003968348200',
            puttparty: '763133495793942528',
            sketchheads: '902271654783242291',
            ocho: '832025144389533716',
        },
        async createTogetherCode(voiceChannelId: string, option: DiscordActivityType) {
            /**
             * @param {string} code The invite link (only use the blue link)
             */
            let returnData = {
                code: 'none',
            };
            if (option && this.applications[option.toLowerCase()]) {
                let applicationID = this.applications[option.toLowerCase()];
                try {
                    await fetch(`https://discord.com/api/v8/channels/${voiceChannelId}/invites`, {
                        method: 'POST',
                        body: JSON.stringify({
                            max_age: 86400,
                            max_uses: 0,
                            target_application_id: applicationID,
                            target_type: 2,
                            temporary: false,
                            validate: null,
                        }),
                        headers: {
                            Authorization: `Bot ${this.token}`,
                            'Content-Type': 'application/json',
                        },
                    })
                        .then((res) => res.json())
                        .then((invite) => {
                            if (invite.error || !invite.code) throw new Error('An error occured while retrieving data !');
                            if (Number(invite.code) === 50013) console.warn('Your bot lacks permissions to perform that action');
                            returnData.code = `https://discord.com/invite/${invite.code}`;
                        });
                } catch (err) {
                    throw new Error('An error occured while starting Youtube together !');
                }
                return returnData;
            } else {
                throw new SyntaxError('Invalid option !');
            }
        }
    };

    constructor() {
        super({ intents: 32767 });
        this.sweepers.sweepMessages
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

        this.on("ready", () => {
            new API(this).start(process.env.port);
            new WebSocket(this).start(process.env.socketPort);
        });

        this.player = new Player(this, {
            ytdlOptions: {
                quality: "highestaudio",
                highWaterMark: 1 << 25
            }
        });

        this.player.on("error", (err) => {
            if (process.env.environment === "dev" || process.env.environment === "debug") {
                console.error(err);
            }
        });

        this.player.on("trackAdd", (queue, track) => {
            let musicEmbed = new MusicEmbed()
                .setTitle("Queue updated")
                .setDescription(`**[${track.title}](${track.url})** has been added to the Queue`)
                .setThumbnail(track.thumbnail)
                .setFooter({ text: `Duration: ${track.duration}` });
            let interaction = queue.metadata as ExtendedInteraction;
            interaction.reply({ embeds: [musicEmbed] });
        });

        this.player.on("tracksAdd", (queue, tracks) => {
            let musicEmbed = new MusicEmbed()
                .setTitle("Queue updated")
                .setDescription(`**${tracks.length} songs from [${tracks[0].playlist.title}](${tracks[0].playlist.url})** have been successfully added to the Queue.`)
                .setThumbnail(tracks[0].playlist.thumbnail);
            let interaction = queue.metadata as ExtendedInteraction;
            interaction.reply({ embeds: [musicEmbed] });
        });
    }
    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            if (process.env.environment === "dev" || process.env.environment === "debug") {
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

    /* async registerPrivateCommands({ commands, guildId }: RegisterCommandsOptions) {
        if(guildId !== undefined) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering private commands to ${this.guilds.cache.get(guildId).name}`);
        }
    } */

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
                guildId: process.env.guildId
            });
            /* this.registerPrivateCommands({
                commands: privateSlashCommands,
                guildId: process.env.guildId
            }); */
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
                embedColor: "Blurple",
                embedColorEnd: "DarkRed",
                reaction: '🎉'
            }
        });
    }
}
