import { Command } from '../../Interfaces';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'meme',
    category: 'Fun',
    description: 'Summon funny memes with the power of this command.',
    aliases: ['fun', 'funny'],
    run: async(client, args, message) => {

        const reply = await message.channel.send('Getting the meme for ya...');

        const json = await fetch('https://meme-api.herokuapp.com/gimme')
            .then(res => res.json());
        
        let meme;
        
        if(json.nsfw === false) {
            meme = new MessageEmbed()
                .setColor(client.config.colors.fun)
                .setTitle(json.title)
                .setURL(json.postLink)
                .setImage(json.url)
                .setFooter(`r/${json.subreddit} · Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }));
        } else {
            meme = `Unfortunately, the meme contains NSFW content, so I won't show it for obvious reasons.`;
        }

        reply.edit({content: ' ', embeds: [meme]});
    }
}