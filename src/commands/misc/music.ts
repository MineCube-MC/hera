import { Command } from "../../structures/Command";
import { client } from "../..";
import { Queue, QueueRepeatMode } from "discord-player";
import { MusicEmbed } from "../../structures/Embed";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import playdl from 'play-dl';

export default new Command({
    name: "music",
    description: "Manage the music in your current server",
    options: [
        {
            name: "play",
            description: "Play a song",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "query",
                    description: "The query/url for the song/playlist",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "pause",
            description: "Pause the current song",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "resume",
            description: "Resume the current song",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "skip",
            description: "Skip the current song",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "stop",
            description: "Stop the current song",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "volume",
            description: "Change the volume of the current song",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "volume",
                    description: "The volume you want to set the song to",
                    type: ApplicationCommandOptionType.Number,
                    required: true
                }
            ]
        },
        {
            name: "queue",
            description: "View the current queue",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "nowplaying",
            description: "View the current song",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "shuffle",
            description: "Shuffle the current queue",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "bassboost",
            description: "Have fun with your ears",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "loop",
            description: "Loop the current song",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "queue_mode",
                    description: "The mode you want to set the loop to",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    choices: [
                        {
                            name: "off",
                            value: QueueRepeatMode.OFF
                        },
                        {
                            name: "track",
                            value: QueueRepeatMode.TRACK
                        },
                        {
                            name: "queue",
                            value: QueueRepeatMode.QUEUE
                        },
                        {
                            name: "autoplay",
                            value: QueueRepeatMode.AUTOPLAY
                        }
                    ]
                }
            ]
        }
    ],
    run: async ({ interaction, args }) => {
        const query = args.getSubcommand();
        if (!interaction.member.voice.channel) {
            return interaction.reply(
                "You need to be in a voice channel to use this command"
            );
        }
        if (!interaction.member.voice.channel.joinable) {
            return interaction.reply(
                "I don't have permission to join your voice channel"
            );
        }
        /* if (interaction.member?.voice?.channel.id !== interaction.guild.me?.voice?.channelId) {
            return interaction.reply(
                "I'm already playing in a different voice channel!"
            );
        } */
        let queue: Queue;
        let embed: MusicEmbed = new MusicEmbed();
        switch (query) {
            case "play":
                const string = args.getString("query", true);

                const guildQueue = client.player.getQueue(interaction.guild.id);

                const channel = interaction.member?.voice?.channel;

                if (!channel)
                    return interaction.reply("You have to join a voice channel first.");

                if (channel.type === ChannelType.GuildStageVoice) {
                    return interaction.reply("You can't play music in a stage channel.");
                }

                if (guildQueue) {
                    if (channel.id !== interaction.guild.members.me?.voice?.channelId)
                        return interaction.reply("I'm already playing in a different voice channel!");
                } else {
                    if (!channel.viewable)
                        return interaction.reply("I need **\`VIEW_CHANNEL\`** permission.");
                    if (!channel.joinable)
                        return interaction.reply("I need **\`CONNECT_CHANNEL\`** permission.");
                    if (!channel.speakable)
                        return interaction.reply("I need **\`SPEAK\`** permission.");
                    if (channel.full)
                        return interaction.reply("Can't join, the voice channel is full.");
                }

                let result;
                try {
                    result = await client.player.search(args.getString("query"), { requestedBy: interaction.user }).catch((e) => {
                        console.error(e);
                        return interaction.reply(`No result was found for \`${string}\`.`);
                    });
                    if (!result || !result.tracks.length)
                        return interaction.reply(`No result was found for \`${string}\`.`);
                } catch (e) {
                    console.error(e);
                    return interaction.reply(`No result was found for \`${string}\`.`);
                }

                if (guildQueue) {
                    queue = guildQueue;
                    queue.metadata = interaction;
                } else {
                    queue = client.player.createQueue(interaction.guild, {
                        metadata: interaction,
                        async onBeforeCreateStream(track, source, _queue) {
                            if (source === "youtube") return (await playdl.stream(track.url, { discordPlayerCompatibility : true })).stream;
                        }
                    });
                }

                try {
                    if (!queue.connection) await queue.connect(channel);
                } catch (error) {
                    client.player.deleteQueue(interaction.guild.id);
                    return interaction.reply(`Could not join your voice channel!\n\`${error}\``);
                }

                result.playlist ? queue.addTracks(result.tracks) : queue.addTrack(result.tracks[0]);

                if (!queue.playing) await queue.play();

                break;
            case "pause":
                queue = client.player.getQueue(interaction.guildId);
                if (!queue) return await interaction.reply("There are no songs in the queue");
                queue.setPaused(true);
                embed = new MusicEmbed()
                await interaction.reply("Music has been paused! Use `/music resume` to resume the music");
                break;
            case "resume":
                queue = client.player.getQueue(interaction.guildId);
                if (!queue) return await interaction.reply("There are no songs in the queue");
                queue.setPaused(false);
                await interaction.reply("Music has been resumed! Use `/music pause` to pause the music");
                break;
            case "skip":
                queue = client.player.getQueue(interaction.guildId);
                if (!queue) return await interaction.reply("There are no songs in the queue");
                queue.skip();
                await interaction.reply("Music has been skipped!");
                break;
            case "stop":
                queue = client.player.getQueue(interaction.guildId);
                if (!queue) return await interaction.reply("There are no songs in the queue");
                try {
                    queue.stop();
                    queue.clear();
                    queue.destroy();
                } catch (e) { }
                await interaction.reply("Music has been stopped!");
                break;
            case "queue":
                queue = client.player.getQueue(interaction.guildId);
                if (!queue) return await interaction.reply("There are no songs in the queue");
                embed = new MusicEmbed()
                if (queue.playing) {
                    embed.addFields([{
                        name: "Now Playing",
                        value: `[${queue.nowPlaying().title}](${queue.nowPlaying().url})`
                    }]);
                }
                embed.setTitle("Queue")
                    .setFooter({ text: `${queue.tracks.length} songs in the queue` });
                for (let i = 0; i < 10; i++) {
                    const song = queue.tracks[i];
                    if (!song) break;
                    embed.addFields([{
                        name: `${i + 1}. ${song.title}`,
                        value: `Link: ${song.url}\nRequested by: ${song.requestedBy.toString()}\nDuration: ${song.duration}`
                    }]);
                }
                await interaction.reply({
                    embeds: [embed]
                });
                break;
            case "nowplaying":
                queue = client.player.getQueue(interaction.guildId);
                if (!queue && !queue.playing) return await interaction.reply("There's no music playing right now!");
                embed = new MusicEmbed()
                embed.setTitle("Now Playing")
                    .setTitle(queue.nowPlaying().title)
                    .setURL(queue.nowPlaying().url)
                    .setThumbnail(queue.nowPlaying().thumbnail)
                    .addFields([{
                        name: "Duration",
                        value: queue.nowPlaying().duration
                    }, {
                        name: "Requested by",
                        value: queue.nowPlaying().requestedBy.toString()
                    }]);
                await interaction.reply({
                    embeds: [embed]
                });
                break;
            case "volume":
                queue = client.player.getQueue(interaction.guildId);
                if (!queue) return await interaction.reply("There are no songs in the queue");
                const volume = args.getNumber("volume");
                if (volume < 0 || volume > 100) return await interaction.reply("Volume must be between 0 and 100");
                queue.setVolume(volume);
                await interaction.reply(`Volume set to ${volume}`);
                break;
            case "shuffle":
                queue = client.player.getQueue(interaction.guildId);
                if (!queue) return await interaction.reply("There are no songs in the queue");
                queue.shuffle();
                await interaction.reply("Queue shuffled!");
                break;
            case "bassboost":
                queue = client.player.getQueue(interaction.guildId);
                if (!queue) return await interaction.reply("There are no songs in the queue");
                await queue.setFilters({
                    bassboost: !queue.getFiltersEnabled().includes('bassboost'),
                    normalizer2: !queue.getFiltersEnabled().includes('bassboost') // because we need to toggle it with bass
                });
                await interaction.reply(`Bass boost successfully ${queue.getFiltersEnabled().includes('bassboost') ? 'enabled' : 'disabled'}!`);
                break;
            case "loop":
                queue = client.player.getQueue(interaction.guildId);
                if (!queue) return await interaction.reply("There are no songs in the queue");
                let queueMode = args.getInteger("queue_mode");
                let queueMsg: string;
                if (queueMode === QueueRepeatMode.OFF) {
                    queue.setRepeatMode(QueueRepeatMode.OFF);
                    queueMsg = "Off";
                } else if (queueMode === QueueRepeatMode.TRACK) {
                    queue.setRepeatMode(QueueRepeatMode.TRACK);
                    queueMsg = "Track";
                } else if (queueMode === QueueRepeatMode.QUEUE) {
                    queue.setRepeatMode(QueueRepeatMode.QUEUE);
                    queueMsg = "Queue";
                } else if (queueMode === QueueRepeatMode.AUTOPLAY) {
                    queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                    queueMsg = "Autoplay";
                }
                interaction.reply({
                    embeds: [new MusicEmbed().setTitle("Looping").setDescription(`Looping mode set to **${queueMsg}**!`)]
                });
        }
    }
});