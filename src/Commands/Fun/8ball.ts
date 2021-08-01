import { Command } from '../../Interfaces';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: '8ball',
    category: 'Fun',
    aliases: [],
    description: 'Replies to your questions',
    run: async(client, args, message) => {
        const question = args.slice(0).join(' ');
        if(!question) return message.channel.send("You didn't ask a question");
        const url = 'https://8ball.delegator.com/magic/JSON/' + question;

        const reply = await message.channel.send(`I'm replying to your question...`);

        const json = await fetch(url)
            .then(res => res.json());
        
        let embedColor;
        if(json.magic.type === "Affirmative") embedColor = "#0dba35";
        if(json.magic.type === "Contrary") embedColor = "#ba0d0d";
        if(json.magic.type === "Neutral") embedColor = "#6f7275";

        reply.edit('Look at the embed:');
        reply.edit({ content: 'Look at the embed:', embeds: [
            new MessageEmbed()
                .setTitle('8ball')
                .setColor(embedColor)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .addField("Question: ", question, false)
                .addField("Asked by: ", message.author.tag, false)
                .addField("Reply: ", json.magic.answer, false)
                .setFooter("API provided by Delegator 8ball")
        ] });
    }
}