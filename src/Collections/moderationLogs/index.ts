import { Collection } from 'discord.js';

export const moderationLogsCollection: Collection<
    string,
    string
> = new Collection();