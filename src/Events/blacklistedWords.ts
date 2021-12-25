import { Event } from '../Interfaces';
import { ColorResolvable, Message, MessageEmbed, TextChannel } from 'discord.js';
import { blacklistedWordsCollection as blacklistCollection, moderationLogsCollection as logsCollection } from '../Collections';

export const event: Event = {
    name: 'messageCreate',
    run: async (client, message: Message) => {
        if(!message.guild) return;
        if(message.author.id === client.user.id) return;
        const splittedMessage = message.content.split(" ");
        let deleting: boolean = false;

        await Promise.all(
            splittedMessage.map((content) => {
                if(blacklistCollection.get(message.guild.id)?.includes(content.toLowerCase())) deleting = true;
            })
        );

        if(deleting) {
            message.delete();
            const logsChannel = message.guild.channels.cache.find(ch => ch.id === logsCollection.get(message.guild.id));
            if(!logsChannel) return;
            if (!((logsChannel): logsChannel is TextChannel => logsChannel.type === 'GUILD_TEXT')(logsChannel)) return;
            logsChannel.send({ embeds: [
                new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor((client.config.colors.main as ColorResolvable))
                    .setTitle('Message Deleted')
                    .setDescription(
                        `**❯ Message ID:** ${message.id}\n` +
                        `**❯ Channel:** <#${message.channel.id}>\n` +
                        `\n**❯ Deleted Message:** ${message.content}`
                    )
            ] });
        }
    }
}