import { Client, Collection } from 'discord.js';
import { connect } from 'mongoose';
import path from 'path';
import { readdirSync } from 'fs';
import { Command, Event, Config } from '../Interfaces';
import ConfigJson from '../config.json';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

class ExtendedClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public aliases: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public config: Config = ConfigJson;
    public executedCooldown = new Set();

    public async init() {
        clear();
        console.log(chalk.cyanBright(figlet.textSync('Apexie', { horizontalLayout: 'full' })));

        this.login(this.config.token);
        connect(this.config.mongoURI, {
            "useUnifiedTopology": true,
            "useFindAndModify": false,
            "useNewUrlParser": true
        }).then(() => {
            console.log(`[ApexieClient] Database => ${chalk.greenBright('Connected!')}`);
        });

        /* Commands */
        const commandPath = path.join(__dirname, "..", "Commands");
        readdirSync(commandPath).forEach((dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.ts'));

            for (const file of commands) {
                const { command } = require(`${commandPath}/${dir}/${file}`);
                this.commands.set(command.name, command);
                if(command?.aliases.length !== 0) {
                    command.aliases.forEach((alias) => {
                        this.aliases.set(alias, command);
                    });
                }
                console.log(`[ApexieClient] ${chalk.underline(this.capitalize(command.name))} command => ${chalk.yellowBright('Loaded!')}`);
            }
        });

        /* Events */
        const eventPath = path.join(__dirname, "..", "Events");
        readdirSync(eventPath).forEach(async (file) => {
            const { event } = await import(`${eventPath}/${file}`);
            this.events.set(event.name, event);
            console.log(`[ApexieClient] ${chalk.underline(this.capitalize(file.replace(/.ts/g,'')))} event => ${chalk.magentaBright('Loaded!')}`);
            this.on(event.name, event.run.bind(null, this));
        });
    }
    
    public capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public removeDuplicates(arr) {
        return [...new Set(arr)];
    }
}

export default ExtendedClient;