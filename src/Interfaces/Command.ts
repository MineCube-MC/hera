import Client from '../Client';
import { Message } from 'discord.js';

interface Run {
    (client: Client, message: Message, args: String[])
}

export interface Command {
    name: string;
    description?: string;
    category: string;
    aliases?: string[];
    run: Run;
}