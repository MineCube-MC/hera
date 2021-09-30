import { Task } from '../Interfaces';

export const task: Task = {
    name: 'statusChange',
    interval: 60,
    async execute(client) {
        let randomMsg = client.config.statusMessages[Math.floor(Math.random() * client.config.statusMessages.length)];
        client.user.setActivity(randomMsg);
    }
}