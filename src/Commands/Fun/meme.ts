import { Command } from '../../Interfaces';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'meme',
    description: 'Summon funny memes with the power of this command.',
    async execute(interaction, client) {
        await interaction.reply('Getting the meme for ya...');

        const json = await fetch('https://meme-api.herokuapp.com/gimme')
            .then(res => res.json());
        
        let meme;
        
        if(json.nsfw === false) {
            meme = new MessageEmbed()
                .setColor(client.config.colors.fun)
                .setTitle(json.title)
                .setURL(json.postLink)
                .setImage(json.url)
                .setFooter(`r/${json.subreddit} · Requested by ${interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }));
        } else {
            meme = `Unfortunately, the meme contains NSFW content, so I won't show it for obvious reasons.`;
        }

        interaction.editReply({content: ' ', embeds: [meme]});
    }
}