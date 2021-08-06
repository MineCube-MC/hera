import Client from '../Client';
import { CommandInteraction } from 'discord.js';

interface Run {
    (client: Client, args: string[], interaction?: CommandInteraction)
}

export interface Command {
    name: string;
    type?: 'both' | 'console' | 'bot';
    description?: string;
    category: string;
    usage?: string;
    run: Run;
}