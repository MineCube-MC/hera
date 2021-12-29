import { Guild, TextChannel } from "discord.js";
import { moderationLogsSchema } from "../../Models/moderationLogs";
import { autoRolesCollection, moderationLogsCollection } from "../../Collections";
import { autoRolesSchema } from "../../Models/autoRoles";

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

    public static async setAutoRoles(guild: Guild, rolesArray: string[]) {
        autoRolesSchema.findOne({ Guild: guild.id }, async (err, data) => {
            if(data) {
                (data.AutoRoles as string[]) = rolesArray;
                data.save();
                autoRolesCollection.set(guild.id, rolesArray);
            } else {
                new autoRolesSchema({
                    Guild: guild.id,
                    AutoRoles: rolesArray
                }).save();
                autoRolesCollection.set(guild.id, rolesArray);
            }
        });
    }

    public static async getAutoRoles(guild: Guild) {
        return autoRolesCollection.get(guild.id) || "";
    }

}