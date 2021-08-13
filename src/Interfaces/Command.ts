import { ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction } from 'discord.js';
import Client from '../Client';
export interface Command {
    name: string;
    description: string;
    options?: Array<ApplicationCommandOptionData>;
    execute(interaction: CommandInteraction, client?: Client): any;
}