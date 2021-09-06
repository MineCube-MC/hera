import { Task } from '../Interfaces';
import { MessageEmbed, TextChannel } from 'discord.js';
import { partnersSchema as Schema } from '../Models/partners';

export const task: Task = {
    name: 'partnersCheck',
    interval: 21600,
    async execute(client) {
        let channelFind;
        Schema.findOne({ Guild: client.config.partnership.mainGuild }, async(err, data) => {
            if(data) channelFind = data.Channel;
        });
        const logsChannel = client.channels.cache.find(ch => ch.id === channelFind);
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