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
                    description: 'The invite link for the server.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'guild',
                    description: 'The server ID of the server (enable Developer Mode to get it).',
                    type: 'STRING',
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove an existing partnership',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'guild',
                    description: 'The server ID of the server (enable Developer Mode to get it).',
                    type: 'STRING',
                    required: true
                }
            ]
        },
        {
            name: 'sponsor',
            description: 'Send a sponsor message',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'title',
                    description: 'The title/name of the sponsored product.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'description',
                    description: 'The description of the sponsored product. Any \\n will be a new line on the description',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'links',
                    description: 'The links of the sponsored product.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'ping',
                    description: 'Should @everyone get pinged for the sponsored product?',
                    type: 'BOOLEAN',
                    required: true
                },
                {
                    name: 'image',
                    description: 'The image of the sponsored product.',
                    type: 'STRING',
                    required: false
                }
            ]
        }
    ],
    description: `Manage the partnerships of Apexie's World`,
    async execute(interaction, client) {

        const action = interaction.options.getSubcommand(true);

        if(action === "create") {
            if (!client.config.owners.includes(interaction.user.id)) return interaction.reply({ content: `Only ${client.config.partnership.brandName} owners may use this command.`, ephemeral: true });
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
                        .setDescription(serverDescription.replaceAll('\\n', '\n'))
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
        } else if(action === "remove") {
            const serverId = interaction.options.getString("guild");

            Schema.findOne({ Guild: serverId }, async(err, data) => {
                if(!data) return interaction.reply({ content: `The specified server was not found`, ephemeral: true });

                const name = data.Name;

                await Schema.deleteOne({ Guild: serverId }, () => {
                    Collection.delete(serverId);
                    interaction.reply({ content: `The guild **${name}** is not a **${client.config.partnership.brandName}** partner anymore. Feel free to delete the sponsor message.`, ephemeral: true });
                });
            });
        } else if(action === "sponsor") {
            const title = interaction.options.getString("title");
            const description = interaction.options.getString("description");
            const links = interaction.options.getString("links");
            const image = interaction.options.getString("image");

            if(interaction.channel.isText()) {
                const newSponsor = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(title)
                    .setDescription(description.replaceAll('\\n', '\n'))
                    .addField("Links", links)
                    .setFooter(`Sponsored by ${client.config.partnership.brandName}`, client.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();
                
                if(image) newSponsor.setImage(image);

                if(interaction.options.getBoolean("ping")) {
                    interaction.channel.send({
                        content: '@everyone',
                        embeds: [newSponsor]
                    });
                    await interaction.reply({
                        content: `The product **${title}** has been sponsored successfully.`,
                        ephemeral: true
                    });
                    return;
                }

                interaction.channel.send({ embeds: [newSponsor] });

                await interaction.reply({
                    content: `The product **${title}** has been sponsored successfully.`,
                    ephemeral: true
                });
            }
        }
    }
}