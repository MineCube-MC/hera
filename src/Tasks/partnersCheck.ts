import { Task } from '../Interfaces';
import { MessageEmbed, TextChannel } from 'discord.js';
import { partnersSchema as Schema } from '../Models/partners';
import { moderationLogsSchema } from '../Models/moderationLogs';

export const task: Task = {
    name: 'partnersCheck',
    interval: 21600,
    async execute(client) {
        const logsChannel = client.channels.cache.find(ch => ch.id === moderationLogsSchema.findOne({ guild: client.config.partnership.mainGuild }).get('Channel'));
        if(!logsChannel) return;
        if (!((logsChannel): logsChannel is TextChannel => logsChannel.type === 'GUILD_TEXT')(logsChannel)) return;
        Schema.find().then((data) => {
            data.forEach((val: any) => {
                if(!client.guilds.cache.get(val.Guild)) {
                    logsChannel.send({ embeds: [
                        new MessageEmbed()
                            .setColor(client.config.colors.negative)
                            .setTitle('Partnership broken')
                            .setDescription(
                                `**❯ Server ID:** ${val.Guild}\n` +
                                `**❯ Server Name:**${val.Name}`
                            )
                    ] });
                }
            });
        });
    }
}