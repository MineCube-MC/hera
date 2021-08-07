import { ApplicationCommandOption, CommandInteraction } from 'discord.js';

export interface Command {
    name: string;
    description: string;
    options?: ApplicationCommandOption;
    execute(interaction: CommandInteraction): any;
}