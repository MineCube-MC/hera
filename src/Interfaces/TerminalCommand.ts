import Client from '../Client';

export interface TerminalCommand {
    name: string;
    description?: string;
    usage?: string;
    execute(client: Client, args?: string[]): any;
}