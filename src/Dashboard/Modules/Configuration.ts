import { Guild, GuildTextBasedChannel, TextChannel } from "discord.js";
import { moderationLogsSchema } from "../../Models/moderationLogs";
import { autoRolesCollection, moderationLogsCollection, rankingCollection, welcomeChannelCollection } from "../../Collections";
import { autoRolesSchema } from "../../Models/autoRoles";
import { welcomeChannelSchema } from "../../Models/welcomeChannel";
import { rankingSchema } from "../../Models/ranking";

export class Configuration {

    public static async getChannels(guild: Guild) {
        let arrayOfChannels: any[] = guild.channels.cache.map(channel => channel.id);
        return arrayOfChannels;
    }

    public static async changeLogChannel(guild: Guild, channel: GuildTextBasedChannel) {
        moderationLogsSchema.findOne({ Guild: guild.id }, async(err, data) => {
            if(!data) {
                new moderationLogsSchema({
                    Guild: guild.id,
                    Channel: channel.id
                }).save();
                moderationLogsCollection.set(guild.id, channel.id);
            } else {
                data.Channel = channel.id;
                data.save();
                moderationLogsCollection.set(guild.id, channel.id);
            }
        });
    }

    public static getLogChannel(guild: Guild) {
        return moderationLogsCollection.get(guild.id) || "";
    }

    public static async changeWelcomeChannel(guild: Guild, channel: TextChannel) {
        welcomeChannelSchema.findOne({ Guild: guild.id }, async(err, data) => {
            if(!data) {
                new welcomeChannelSchema({
                    Guild: guild.id,
                    Channel: channel.id
                }).save();
                welcomeChannelCollection.set(guild.id, channel.id);
            } else {
                data.Channel = channel.id;
                data.save();
                welcomeChannelCollection.set(guild.id, channel.id);
            }
        });
    }

    public static getWelcomeChannel(guild: Guild) {
        return welcomeChannelCollection.get(guild.id) || "";
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

    public static getAutoRoles(guild: Guild) {
        return autoRolesCollection.get(guild.id) || "";
    }

    public static async setRanking(guild: Guild, enabled: boolean) {
        rankingSchema.findOne({ Guild: guild.id }, async (err, data) => {
            if(!data) {
                new rankingSchema({
                    Guild: guild.id,
                    Enabled: enabled
                }).save();
                rankingCollection.set(guild.id, enabled);
            } else {
                data.Enabled = enabled;
                data.save();
                rankingCollection.set(guild.id, enabled);
            }
        });
    }

    public static getRanking(guild: Guild) {
        let activated: boolean;
        if(!rankingCollection.get(guild.id)) {
            activated = true
        } else {
            activated = rankingCollection.get(guild.id);
        }
        return activated;
    }

}