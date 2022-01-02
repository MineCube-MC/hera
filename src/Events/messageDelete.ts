import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';
import { moderationLogsSchema } from '../Models/moderationLogs';

export const event: Event = {
    name: 'messageDelete',
    run: async(client, message: Message) => {
        const modSchema = await moderationLogsSchema.findOne({ guild: message.guild.id }).get('Channel');
        const logsChannel = client.channels.cache.find(ch => ch.id === modSchema);
        if(!logsChannel) return;
        if (!((logsChannel): logsChannel is TextChannel => logsChannel.type === 'GUILD_TEXT')(logsChannel)) return;
        let logs = await message.guild.fetchAuditLogs({type: 72});
        let entry = logs.entries.first();
        let reason;
        if(entry.executor === message.author) {
            reason = "Deleted by message author";
        } else if(entry.executor === client.user) {
            return;
        } else {
            reason = "Deleted by " + `<@${entry.executor.id}>`;
        }
        logsChannel.send({ embeds: [
            new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(client.config.colors.negative)
                .setTitle('Message Deleted')
                .setDescription(
                    `**❯ Reason:** ${reason}\n` +
                    `**❯ Channel:** <#${message.channel.id}>\n` +
                    `\n**❯ Deleted Message:** ${message.content}`
                )
                .setTimestamp()
        ] });
    }
}