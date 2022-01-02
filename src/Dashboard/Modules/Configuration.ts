import { Guild, GuildTextBasedChannel, TextChannel } from "discord.js";
import { moderationLogsSchema } from "../../Models/moderationLogs";
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
            } else {
                data.Channel = channel.id;
                data.save();
            }
        });
    }

    public static async getLogChannel(guild: Guild) {
        const Schema = await moderationLogsSchema.findOne({ Guild: guild.id });
        return Schema.get('Channel') || "";
    }

    public static async changeWelcomeChannel(guild: Guild, channel: TextChannel) {
        welcomeChannelSchema.findOne({ Guild: guild.id }, async(err, data) => {
            if(!data) {
                new welcomeChannelSchema({
                    Guild: guild.id,
                    Channel: channel.id
                }).save();
            } else {
                data.Channel = channel.id;
                data.save();
            }
        });
    }

    public static async getWelcomeChannel(guild: Guild) {
        const Schema = await welcomeChannelSchema.findOne({ Guild: guild.id });
        return Schema.get('Channel') || "";
    }

    public static async setAutoRoles(guild: Guild, rolesArray: string[]) {
        autoRolesSchema.findOne({ Guild: guild.id }, async (err, data) => {
            if(data) {
                (data.AutoRoles as string[]) = rolesArray;
                data.save();
            } else {
                new autoRolesSchema({
                    Guild: guild.id,
                    AutoRoles: rolesArray
                }).save();
            }
        });
    }

    public static async getAutoRoles(guild: Guild) {
        const Schema = await autoRolesSchema.findOne({ Guild: guild.id });
        return Schema.get('AutoRoles') || "";
    }

    public static async setRanking(guild: Guild, enabled: boolean) {
        await rankingSchema.findOne({ Guild: guild.id }, async (err, data) => {
            if(!data) {
                new rankingSchema({
                    Guild: guild.id,
                    Enabled: enabled
                }).save();
            } else {
                data.Enabled = enabled;
                data.save();
            }
        });
    }

    public static async getRanking(guild: Guild) {
        let activated: boolean;
        await rankingSchema.findOne({ Guild: guild.id }, async (err, data) => {
            if(!data) {
                new rankingSchema({
                    Guild: guild.id,
                    Enabled: true
                }).save();
                activated = true;
            } else {
                activated = data.Enabled;
            }
        });
        return activated;
    }

}