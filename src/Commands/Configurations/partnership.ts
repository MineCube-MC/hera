import { Command } from '../../Interfaces';
import { partnersSchema as Schema } from '../../Models/partners';
import { partnersCollection as Collection } from '../../Collections';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'partnership',
    options: [
        {
            name: 'create',
            description: 'Create a new partnership',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'description',
                    description: 'The description of the server. Any \\n will be a new line on the description',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'invite',
                    description: 'The invite link for the server',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'guild',
                    description: 'The server ID of the server (enable Developer Mode to get it)',
                    type: 'STRING',
                    required: true
                }
            ]
        }
    ],
    description: `Manage the partnerships of Apexie's World`,
    async execute(interaction, client) {
        if (!client.config.owners.includes(interaction.user.id)) return interaction.reply({ content: `Only Apexie's World owners may use this command.`, ephemeral: true });

        const action = interaction.options.getSubcommand(true);

        if(action === "create") {
            const serverId = interaction.options.getString("guild");
            const serverInvite = interaction.options.getString("invite");
            const serverDescription = interaction.options.getString("description");

            if(!client.guilds.cache.get(serverId).members.cache.get(client.user.id)) return interaction.reply({ content: `The server cannot be found in bot's cache (*this usually means that either the server doesn't exist or the bot didn't is not in the specified server*), he partnership cannot be created`, ephemeral: true });

            if(client.guilds.cache.get(serverId).members.cache.size >= 100) {
                const channel = client.channels.cache.get(client.config.partnership.channel);
                const guild = client.guilds.cache.get(serverId);
                if(channel.isText()) {
                    const newPartner = new MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle(guild.name)
                        .setThumbnail(guild.iconURL({ dynamic: true }))
                        .setDescription(serverDescription)
                        .addField("Click the link to join", serverInvite)
                        .setFooter(`Partenered with ${client.config.partnership.brandName}`, client.user.displayAvatarURL({ dynamic: true }))
                        .setTimestamp();
                    channel.send({
                        content: '@everyone',
                        embeds: [newPartner]
                    });
                }
            } else return interaction.reply({ content: `The specified server has less than 100 members, the partnership cannot be created`, ephemeral: true });

            Schema.findOne({ Guild: serverId }, async(err, data) => {
                if(!data) {
                    new Schema({
                        Guild: serverId,
                        Name: client.guilds.cache.get(serverId).name
                    }).save();
                    Collection.set(serverId, client.guilds.cache.get(serverId).name);
                } else {
                    data.Name = client.guilds.cache.get(serverId).name;
                    data.save();
                    Collection.set(serverId, client.guilds.cache.get(serverId).name);
                }
            });

            return interaction.reply({ content: `The partnership has been created successfully`, ephemeral: true });
        }
    }
}