const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const fetch = require('node-fetch');

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = {
    slash: true,
    testOnly: true,
    description: 'Summon some funny memes from the most popular subreddits.',
    callback: ({message, args}) => {
        fetch('https://meme-api.herokuapp.com/gimme')
        .then(res => res.json())
        .then(async json => {
            const memeEmbed = new MessageEmbed()
            .setColor(config.colors.main)
            .setTitle(json.title)
            .setURL(json.postLink)
            .setImage(json.url)
            .setFooter(`r/${json.subreddit}`);

            return memeEmbed;
        });
    }
}