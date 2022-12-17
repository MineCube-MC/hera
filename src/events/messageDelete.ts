import { Role, TextChannel } from "discord.js";
import guildSchema from "../models/guildSchema";
import { ExtendedEmbed } from "../structures/Embed";
import { Event } from "../structures/Event";

export default new Event("messageDelete", async (message) => {
    const member = message.member;

    let guildData;
    try {
        guildData = await guildSchema.findOne({ serverID: member.guild.id });
        if(!guildData) {
            let guild = await guildSchema.create({
                serverID: member.guild.id,
                welcome: {
                    enabled: false,
                    channelID: "none",
                    text: ":wave: Hello {member}, welcome to {guild}!"
                },
                logs: {
                    enabled: false,
                    channelID: "none"
                },
                leveling: {
                    enabled: true
                },
                autoRoles: [],
                blacklist: []
            });
            guild.save();
            guildData = await guildSchema.findOne({ serverID: member.guild.id });
        }
    } catch (e) {
        console.error(e);
    }

    const logChannel = message.guild.channels.cache.get(guildData.logs.channelID) as TextChannel;
    let rolesWithPerms: Role[] = [];

    message.guild.roles.cache.forEach((role) => {
        if(role.permissions.has("ManageMessages") && !role.managed) rolesWithPerms.push(role);
    });

    let logs = await message.guild.fetchAuditLogs({type: 72});
    let entry = logs.entries.first();

    if(logChannel) {
        if(message.content) {
            const deleteEmbed = new ExtendedEmbed()
            .setTitle("Message deleted")
            .setThumbnail(message.member.displayAvatarURL() || message.author.displayAvatarURL())
            .addFields([
                {
                    name: "Author",
                    value: `${message.member}`,
                    inline: true
                },
                {
                    name: "Content",
                    value: `\`${message.content}\``,
                }
            ]);
            if(message.author === entry.executor) {
                deleteEmbed.setDescription("The author deleted his message for whatever reason.");
            } else {
                deleteEmbed
                .setDescription(`Someone with the \`MANAGE_MESSAGES\` permission (probably one of these: ${rolesWithPerms.map(role => `${role}`).join(", ")}) deleted the message of a member in this server.`)
                .addFields(
                    {
                        name: "Deleted by",
                        value: `${entry.executor}`,
                        inline: true
                    }
                );
            }
            logChannel.send({
                embeds: [deleteEmbed]
            });
        }
    }
});