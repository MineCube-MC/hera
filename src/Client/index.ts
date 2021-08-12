import { Client, Collection } from 'discord.js';
import { disconnect } from 'mongoose';
import path from 'path';
import { readdirSync, readFileSync } from 'fs';
import { Command, TerminalCommand, Event, Config } from '../Interfaces';
import { version } from '../../package.json';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import Levels from 'discord-xp';

class ExtendedClient extends Client {
    public arrayOfCommands = [];
    public commands: Collection<string, Command> = new Collection();
    public terminalCmds: Collection<string, TerminalCommand> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public config: Config = JSON.parse(readFileSync(path.join(process.cwd() + '/config.json')).toString());
    public executedCooldown = new Set();

    public async init() {
        clear();
        console.log(chalk.cyanBright(figlet.textSync('Apexie', { horizontalLayout: 'full' })));
        console.log(`Starting Apexie Services ${chalk.italic(`(version ${version})`)}`);

        this.login(this.config.token);

        Levels.setURL(this.config.mongoURI);

        /* Commands */
        const commandPath = path.join(__dirname, "..", "Commands");
        readdirSync(commandPath).forEach((dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.ts'));

            commands.forEach(async (file) => {
                try {
                    const { command } = await import(`${commandPath}/${dir}/${file}`);
                    if(!command?.name) return;
                    this.commands.set(command.name, command);
                    this.arrayOfCommands.push(command);
                    console.log(`[Client] ${chalk.underline(this.capitalize(command.name))} command => ${chalk.yellowBright('Loaded!')}`);
                } catch (e) {
                    console.log(`[Client] ${chalk.underline(this.capitalize(file.replace(/.ts/g,'')))} command => ${chalk.redBright(`Doesn't export a command`)}`);
                }
            });
        });

        /* Terminal commands */

        /* Events */
        const eventPath = path.join(__dirname, "..", "Events");
        readdirSync(eventPath).filter(file => file.endsWith('.ts')).forEach(async (file) => {
            try {
                const { event } = await import(`${eventPath}/${file}`);
                this.events.set(event.name, event);
                this.on(event.name, event.run.bind(null, this));
                console.log(`[Client] ${chalk.underline(this.capitalize(file.replace(/.ts/g,'')))} event => ${chalk.magentaBright('Loaded!')}`);
            } catch (e) {
                console.log(`[Client] ${chalk.underline(this.capitalize(file.replace(/.ts/g,'')))} event => ${chalk.redBright(`Doesn't export an event`)}`);
            }
        });
    }

    public shutdown() {
        console.log(`[Client] Database => ${chalk.redBright('Disconnecting...')}`);
        disconnect();
        console.log(`[Client] Client => ${chalk.redBright('Shutting down...')}`);
        process.exit(0);
    }
    
    public capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public removeDuplicates(arr) {
        return [...new Set(arr)];
    }
}

export default ExtendedClient;