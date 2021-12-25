import { Command } from '../../Interfaces';
import fetch from 'node-fetch';
import request from 'request';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: '8ball',
    description: 'Replies to your questions',
    options: [
        {
            name: 'question',
            description: 'The question you want to ask',
            type: 'STRING',
            required: true
        }
    ],
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const url = 'https://8ball.delegator.com/magic/JSON/' + question;

        await interaction.reply(`I'm replying to your question...`);

        await request({
            url: url,
            json: true
        }, async (err, response, body) => {
            let embedColor;
            if(body.magic.type === "Affirmative") embedColor = "#0dba35";
            if(body.magic.type === "Contrary") embedColor = "#ba0d0d";
            if(body.magic.type === "Neutral") embedColor = "#6f7275";

            interaction.editReply({ embeds: [
                new MessageEmbed()
                    .setTitle('8ball')
                    .setColor(embedColor)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .addField("Question: ", question, false)
                    .addField("Asked by: ", interaction.user.tag, false)
                    .addField("Reply: ", body.magic.answer, false)
                    .setFooter("API provided by Delegator 8ball")
            ]});
        });
    }
}