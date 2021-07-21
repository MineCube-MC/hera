import { Event } from '../Interfaces';
import { Message } from 'discord.js';
import { blacklistedWordsCollection as Collection } from '../Collections';

export const event: Event = {
    name: 'message',
    run: async (client, message: Message) => {
        if(!message.guild) return;
        if(message.author.id === client.user.id) return;
        const splittedMessage = message.content.split(" ");
        let deleting: boolean = false;

        await Promise.all(
            splittedMessage.map((content) => {
                if(Collection.get(message.guild.id)?.includes(content.toLowerCase())) deleting = true;
            })
        );

        if(deleting) return message.delete();
    }
}