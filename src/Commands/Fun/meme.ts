import { Command } from '../../Interfaces';
import request from 'request';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'meme',
    description: 'Summon funny memes with the power of this command.',
    async execute(interaction, client) {
        await interaction.reply('Getting the meme for ya...');
        
        let meme;
        
        await request({
            url: 'https://meme-api.herokuapp.com/gimme',
            json: true
        }, async (err, response, body) => {
            if(body.nsfw === false) {
                meme = new MessageEmbed()
                    .setColor(client.config.colors.fun)
                    .setTitle(body.title)
                    .setURL(body.postLink)
                    .setImage(body.url)
                    .setFooter(`r/${body.subreddit} · Requested by ${interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }));
            } else {
                meme = `Unfortunately, the meme contains NSFW content, so I won't show it for obvious reasons.`;
                return interaction.editReply(meme);
            }

            interaction.editReply({content: ' ', embeds: [meme]});
        });
    }
}