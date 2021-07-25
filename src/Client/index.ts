import { Client, Collection, GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { connect, disconnect } from 'mongoose';
import path from 'path';
import { readdirSync } from 'fs';
import { Command, Event, Config } from '../Interfaces';
import ConfigJson from '../config.json';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import DisTube, { DisTubeOptions } from 'distube';
import SoundCloudPlugin from '@distube/soundcloud';
import SpotifyPlugin from '@distube/spotify';

class ExtendedClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public aliases: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public config: Config = ConfigJson;
    public executedCooldown = new Set();
    public distube = new DisTube(this, {
        searchSongs: true
    });

    public async init() {
        clear();
        console.log(chalk.cyanBright(figlet.textSync('Apexie', { horizontalLayout: 'full' })));

        this.login(this.config.token);

        /* Distube (Music) */
        const status = queue =>
	    `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ')
		    || 'Off'}\` | Loop: \`${
		    queue.repeatMode
			    ? queue.repeatMode === 2
				    ? 'All Queue'
				    : 'This Song'
			    : 'Off'
	    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

        this.distube.on('playSong', (message, queue, song) => {
            message.channel.send(
                new MessageEmbed()
                    .setTitle('Music player')
                    .setColor(this.config.colors.main)
                    .setThumbnail(song.thumbnail)
                    .setDescription(`Playing \`${song.name}\` - \`${
                        song.formattedDuration
                    }\``)
                    .setFooter(`Requested by ${song.user.username}`, song.user.displayAvatarURL({ dynamic: true }))
            )
        });

        /* MongoDB */
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

    public shutdown() {
        console.log(`[ApexieClient] Database => ${chalk.redBright('Disconnecting...')}`);
        disconnect();
        console.log(`[ApexieClient] Client => ${chalk.redBright('Shutting down...')}`);
        process.exit();
    }

    public restart() {
        console.log(`[ApexieClient] Client => ${chalk.yellowBright('Restarting...')}`);
        this.destroy();
        this.login(this.config.token);
        console.log(`[ApexieClient] Client => ${chalk.greenBright('Ready!')}`);
    }
    
    public capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public removeDuplicates(arr) {
        return [...new Set(arr)];
    }
}

export default ExtendedClient;