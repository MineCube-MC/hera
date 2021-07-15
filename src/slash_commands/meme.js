const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const fetch = require('node-fetch');

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = {
    slash: "both",
    testOnly: true,
    description: 'Summon some funny memes from the most popular subreddits.',
    callback: async ({message, args}) => {
        const json = await fetch('https://meme-api.herokuapp.com/gimme')
        .then(res => res.json());

        if(!json.nsfw === true) {
            const memeEmbed = new MessageEmbed()
            .setColor(config.colors.main)
            .setTitle(json.title)
            .setURL(json.postLink)
            .setImage(json.url)
            .setFooter(`r/${json.subreddit}`);

            if(message) message.reply(memeEmbed);

            return memeEmbed;
        } else {
            const reply = `Unfortunately, the meme contains NSFW content, so I won't show it for obvious reasons.`;

            if(message) message.reply(reply);

            return reply;
        }
    }
}