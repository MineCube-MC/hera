const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const fetch = require('node-fetch');

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = {
    name: 'meme',
    category: 'Fun',
    aliases: [],
    description: 'Summon some funny memes from the most popular subreddits.',

    run: async (client, message) => {
        fetch('https://meme-api.herokuapp.com/gimme')
        .then(res => res.json())
        .then(async json => {
            const memeEmbed = new MessageEmbed()
            .setColor(config.colors.main)
            .setTitle(json.title)
            .setURL(json.postLink)
            .setImage(json.url)
            .setFooter(`r/${json.subreddit}`);

            let msg = await message.reply('Fetching a meme from the dankest subreddits...');
            if (json.nsfw === true) {
                msg.edit(`<@${message.author.id}> Unfortunately, the meme contains NSFW content, so we won't show it for obvious reasons.`);
            } else {
                msg.edit(`<@${message.author.id}> Here's a meme:`)
                msg.edit(memeEmbed);
            }
        })
    }
}