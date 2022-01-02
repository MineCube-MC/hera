import { Event } from '../Interfaces';
import chalk from 'chalk';
import { ClientPrompt } from '../Terminal';
import { connect } from 'mongoose';
import { ClientDashboard } from '../Dashboard';
import DBD from 'discord-dashboard';

export const event: Event = {
    name: 'ready',
    run: async (client) => {
        if (client.config.terminal.verbose) console.log('Logged in as ' + chalk.italic(client.user.tag));
        if (client.config.terminal.verbose) console.log(`Client => ${chalk.greenBright('Ready!')}`);

        if(client.config.testMode.enabled) {
            client.guilds.cache.get(client.config.testMode.guild).commands.set(client.arrayOfCommands);
        } else {
            // console.log(client.arrayOfCommands);
            client.application.commands.set(client.arrayOfCommands);
        }

        connect(client.config.mongoURI).then(() => {
            if (client.config.terminal.verbose) console.log(`Database => ${chalk.greenBright('Connected!')}`);
        }).finally(async () => {
            client.tasks.forEach(async task => {
                setInterval(async () => {
                    await task.execute(client);
                }, task.interval * 1000);
            });
            await DBD.useLicense(client.config.dashboard.license);
            new ClientDashboard(client);
            new ClientPrompt(client);
        });
    }
}