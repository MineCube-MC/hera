import { Command } from '../../Interfaces';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: '8ball',
    category: 'Fun',
    description: 'Replies to your questions',
    run: async(client, args, interaction) => {
        const question = args.slice(0).join(' ');
        if(!question) return interaction.reply("You didn't ask a question");
        const url = 'https://8ball.delegator.com/magic/JSON/' + question;

        await interaction.reply(`I'm replying to your question...`);

        const json = await fetch(url)
            .then(res => res.json());
        
        let embedColor;
        if(json.magic.type === "Affirmative") embedColor = "#0dba35";
        if(json.magic.type === "Contrary") embedColor = "#ba0d0d";
        if(json.magic.type === "Neutral") embedColor = "#6f7275";

        interaction.editReply('Look at the embed:');
        interaction.editReply({ content: 'Look at the embed:', embeds: [
            new MessageEmbed()
                .setTitle('8ball')
                .setColor(embedColor)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .addField("Question: ", question, false)
                .addField("Asked by: ", interaction.user.tag, false)
                .addField("Reply: ", json.magic.answer, false)
                .setFooter("API provided by Delegator 8ball")
        ] });
    }
}