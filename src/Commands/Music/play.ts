import { Command } from '../../Interfaces';
import distube from 'distube';

export const command: Command = {
    name: 'play',
    category: 'Music',
    aliases: [],
    description: 'Plays a music of your choice',
    run: async(client, message, args) => {
        if(!args[0]) return message.reply('You need to specify some keywords or an URL.');
        if(!message.member.voice.channel) return message.reply('You need to be in a voice channel for this to work.');
        const videoUrl = args.join(' ');
        client.distube.play(message, videoUrl);
    }
}