import { Event } from '../Interfaces';
import chalk from 'chalk';
import { blacklistedWordsSchema } from '../Models/blacklistedWords';
import { blacklistedWordsCollection } from '../Collections';

export const event: Event = {
    name: 'ready',
    run: (client) => {
        console.log('[ApexieClient] Logged in as ' + chalk.italic(client.user.tag));
        console.log('[ApexieClient] Client => ' + chalk.greenBright('Ready!'));
        console.log('[ApexieClient] Type ' + chalk.italic(`"${client.config.prefix}help"`) + ' for a list of commands.');

        blacklistedWordsSchema.find().then((data) => {
            data.forEach((val: any) => {
                blacklistedWordsCollection.set(val.Guild, val.Words);
            });
        });
    }
}