import Client from '../Client';

export interface Task {
    name: string;
    interval: number;
    execute(client: Client): any;
}