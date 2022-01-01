import { Client, Collection } from 'discord.js';
import { disconnect } from 'mongoose';
import { Command, TerminalCommand, Event, Config, Task } from '../Interfaces';
import { version } from '../../package.json';
import chalk from 'chalk';
import path from 'path';
import { readdirSync } from 'fs';
import Levels from 'discord-xp';
import { DiscordTogether } from 'discord-together';
import { GiveawaysManager } from 'discord-giveaways';

export class ExtendedClient extends Client {
    public arrayOfCommands: any[] = [];
    public commands: Collection<string, Command> = new Collection();
    public terminalCmds: Collection<string, TerminalCommand> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public tasks: Collection<string, Task> = new Collection();
    public config: Config;
    public activities = new DiscordTogether(this);
    public giveaways: GiveawaysManager;

    public constructor(config: Config) {
        super({
            intents: [
                'GUILDS',
                'GUILD_MESSAGES',
                'GUILD_BANS',
                'GUILD_MEMBERS',
                'GUILD_PRESENCES',
                'GUILD_MESSAGE_REACTIONS',
                'GUILD_VOICE_STATES',
                'GUILD_INTEGRATIONS',
                'GUILD_EMOJIS_AND_STICKERS',
                'GUILD_MESSAGE_TYPING']
        });
        this.config = config;

        this.giveaways = new GiveawaysManager(this, {
            storage: "./giveaways.json",
            default: {
                botsCanWin: false,
                embedColor: this.config.colors.secondary,
                embedColorEnd: this.config.colors.negative,
                reaction: '🎉'
            }
        });

        console.clear();
        console.log(`Apexie Shell ${version}`);
        console.log(`Copyright (c) Apexie Development.`);
        console.log(`\nhttps://github.com/ApexieDevelopment/ApexieServices \nType 'help' to get help.`);

        let token;
        token = this.config.token;
        this.login(token);

        Levels.setURL(this.config.mongoURI);

        /* Commands */
        const commandPath = path.join(__dirname, "..", "Commands");
        readdirSync(commandPath).forEach((dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.js'));

            commands.forEach(async (file) => {
                try {
                    const { command } = await import(`${commandPath}/${dir}/${file}`);
                    if(!command?.name) return;
                    this.commands.set(command.name, command);
                    this.arrayOfCommands.push(command);
                    if (this.config.terminal.verbose) console.log(`${chalk.underline(this.capitalize(command.name))} command => ${chalk.yellowBright('Loaded!')}`);
                } catch (e) {
                    console.log(`${chalk.underline(this.capitalize(file.replace(/.ts/g,'')))} command => ${chalk.redBright(`Unable to load the command`)}`);
                }
            });
        });

        /* Terminal commands */
        const terminalCmdPath = path.join(__dirname, "..", "Terminal", "Commands");
        const terminalCmds = readdirSync(`${terminalCmdPath}`).filter((file) => file.endsWith('.js'));
        terminalCmds.forEach(async (file) => {
            try {
                const { command } = await import(`${terminalCmdPath}/${file}`);
                if(!command?.name) return;
                this.terminalCmds.set(command.name, command);
                if (this.config.terminal.verbose) console.log(`${chalk.underline(this.capitalize(command.name))} command => ${chalk.whiteBright('Loaded!')}`);
            } catch (e) {
                console.log(`${chalk.underline(this.capitalize(file.replace(/.ts/g,'')))} command => ${chalk.redBright(`Unable to load the terminal command`)}`);
            }
        });

        /* Events */
        const eventPath = path.join(__dirname, "..", "Events");
        readdirSync(eventPath).filter(file => file.endsWith('.js')).forEach(async (file) => {
            try {
                const { event } = await import(`${eventPath}/${file}`);
                this.events.set(event.name, event);
                this.on(event.name, event.run.bind(null, this));
                if (this.config.terminal.verbose) console.log(`${chalk.underline(this.capitalize(file.replace(/.ts/g,'')))} event => ${chalk.magentaBright('Loaded!')}`);
            } catch (e) {
                console.log(`${chalk.underline(this.capitalize(file.replace(/.ts/g,'')))} event => ${chalk.redBright(`Unable to load the event`)}`);
            }
        });

        /* Tasks */
        const tasksPath = path.join(__dirname, "..", "Tasks");
        const tasks = readdirSync(`${tasksPath}`).filter((file) => file.endsWith('.js'));
        tasks.forEach(async (file) => {
            try {
                const { task } = await import(`${tasksPath}/${file}`);
                if(!task?.name) return;
                this.tasks.set(task.name, task);
                if (this.config.terminal.verbose) console.log(`${chalk.underline(this.capitalize(task.name))} task => ${chalk.cyanBright('Loaded!')}`);
            } catch (e) {
                console.log(`${chalk.underline(this.capitalize(file.replace(/.ts/g,'')))} command => ${chalk.redBright(`Unable to load the task`)}`);
            }
        });
    }

    public shutdown() {
        if (this.config.terminal.verbose) console.log(`Database => ${chalk.redBright('Disconnecting...')}`);
        disconnect();
        if (this.config.terminal.verbose) console.log(`Client => ${chalk.redBright('Shutting down...')}`);
        process.exit(0);
    }
    
    public capitalize(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public removeDuplicates(arr: any) {
        return [...new Set(arr)];
    }
}

export default ExtendedClient;
