import { Event } from '../Interfaces';
import { ColorResolvable, Message, MessageEmbed, TextChannel } from 'discord.js';
import { blacklistedWordsSchema } from '../Models/blacklistedWords';
import { moderationLogsSchema } from '../Models/moderationLogs';

export const event: Event = {
    name: 'messageCreate',
    run: async (client, message: Message) => {
        if(!message.guild) return;
        if(message.author.id === client.user.id) return;
        const splittedMessage = message.content.split(" ");
        let deleting: boolean = false;
        const Schema = await blacklistedWordsSchema.findOne({ guild: message.guild.id }).clone();

        await Promise.all(
            splittedMessage.map((content) => {
                if(Schema.get('Words')?.includes(content.toLowerCase())) deleting = true;
            })
        );

        if(deleting) {
            message.delete();
            const modSchema = await moderationLogsSchema.findOne({ guild: message.guild.id }).clone();
            const logsChannel = message.guild.channels.cache.find(ch => ch.id === modSchema.get('Channel'));
            if(!logsChannel) return;
            if (!((logsChannel): logsChannel is TextChannel => logsChannel.type === 'GUILD_TEXT')(logsChannel)) return;
            logsChannel.send({ embeds: [
                new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor((client.config.colors.main as ColorResolvable))
                    .setTitle('Message Deleted')
                    .setDescription(
                        `**❯ Message ID:** ${message.id}\n` +
                        `**❯ Reason:** Blacklisted word\n` +
                        `**❯ Channel:** <#${message.channel.id}>\n` +
                        `\n**❯ Deleted Message:** ${message.content}`
                    )
            ] });
        }
    }
}