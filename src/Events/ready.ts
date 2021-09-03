import chalk from 'chalk';
import { Event } from '../Interfaces';
import { ClientPrompt } from '../Terminal';

export const event: Event = {
    name: 'ready',
    run: (client) => {
        if (client.config.terminal.verbose) console.log('Logged in as ' + chalk.italic(client.user.tag));
        if (client.config.terminal.verbose) console.log(`Client => ${chalk.greenBright('Ready!')}`);

        if(client.config.testMode.enabled) {
            client.guilds.cache.get(client.config.testMode.guild).commands.set(client.arrayOfCommands);
        } else {
            client.application.commands.set(client.arrayOfCommands);
        }

        client.tasks.forEach(async task => {
            setInterval(async () => {
                await task.execute(client);
            }, task.interval * 1000);
        });
        new ClientPrompt(client);
    }
}