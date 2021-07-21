import { Collection } from 'discord.js';

export const blacklistedWordsCollection: Collection<
    string,
    string[]
> = new Collection();