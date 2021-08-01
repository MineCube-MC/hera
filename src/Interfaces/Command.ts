import Client from '../Client';
import { Message } from 'discord.js';

interface Run {
    (client: Client, args: string[], message?: Message)
}

export interface Command {
    name: string;
    type?: 'both' | 'console' | 'bot';
    description?: string;
    category: string;
    aliases: string[];
    usage?: string;
    run: Run;
}