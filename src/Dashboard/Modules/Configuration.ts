import { Guild, TextChannel } from "discord.js";
import { moderationLogsSchema } from "../../Models/moderationLogs";
import { moderationLogsCollection } from "../../Collections";

export class Configuration {

    public static async getChannels(guild: Guild) {
        let arrayOfChannels: any[] = guild.channels.cache.map(channel => channel.id);
        return arrayOfChannels;
    }

    public static async changeLogChannel(channel: TextChannel) {
        moderationLogsSchema.findOne({ Guild: channel.guildId }, async(err, data) => {
            if(!data) {
                new moderationLogsSchema({
                    Guild: channel.guildId,
                    Channel: channel.id
                }).save();
                moderationLogsCollection.set(channel.guildId, channel.id);
            } else {
                data.Channel = channel.id;
                data.save();
                moderationLogsCollection.set(channel.guildId, channel.id);
            }
        });
    }

    public static async getLogChannel(guild: Guild) {
        return moderationLogsCollection.get(guild.id) || "";
    }

}