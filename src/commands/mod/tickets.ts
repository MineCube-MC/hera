import { ApplicationCommandOptionType, ChannelType } from 'discord.js'
import { Command } from '../../structures/Command'
import guildSchema from '../../models/guildSchema'
import ticketSchema from '../../models/ticketSchema'
import { ExtendedEmbed } from '../../structures/Embed'

export default new Command({
  name: 'tickets',
  description: 'Manage the tickets system in this guild',
  userPermissions: ["Administrator"],
  options: [
    {
      name: 'enable',
      description: 'Enable the tickets system in this guild',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'channel',
          description: 'The channel where people will be able to open tickets',
          type: ApplicationCommandOptionType.Channel,
          channelTypes: [ChannelType.GuildText],
          required: true
        },
        {
          name: 'category',
          description: 'The category where ticket channels will be created',
          type: ApplicationCommandOptionType.Channel,
          channelTypes: [ChannelType.GuildCategory],
          required: true
        }
      ]
    },
    {
      name: 'disable',
      description: 'Disable the tickets system in this guild',
      type: ApplicationCommandOptionType.Subcommand
    }
  ],
  run: async ({ interaction, args }) => {
    const query = args.getSubcommand()

    let guildData
    try {
      guildData = await guildSchema.findOne({ serverID: interaction.guildId })
      if (!guildData) {
        let guild = await guildSchema.create({
          serverID: interaction.guildId,
          welcome: {
            enabled: false,
            channelID: 'none',
            text: ':wave: Hello {member}, welcome to {guild}!'
          },
          logs: {
            enabled: false,
            channelID: 'none'
          },
          tickets: {
            enabled: false,
            channelID: 'none',
            categoryID: 'none'
          },
          autoRoles: [],
          blacklist: []
        })
        guild.save()
        guildData = await guildSchema.findOne({ serverID: interaction.guildId })
      }
    } catch (e) {
      console.error(e)
    }

    if (query === 'enable') {
      const channel = args.getChannel('channel')
      const category = args.getChannel('category')
      const response = await guildSchema.findOneAndUpdate({
        serverID: interaction.guildId
      }, {
        $set: {
          tickets: {
            enabled: true,
            channelID: channel.id,
            categoryID: category.id
          }
        }
      })
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new ExtendedEmbed()
          .setTitle("Operation Successful")
          .setDescription(`Tickets have been successfully enabled and setup`)
        ]
      })
    }
  }
})