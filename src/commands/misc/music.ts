import { Command } from "../../structures/Command";
import { client } from "../..";
import { QueryType, Queue, QueueRepeatMode } from "discord-player";
import { MusicEmbed } from "../../structures/Embed";

export default new Command({
    name: "music",
    description: "Manage the music in your current server",
    options: [
        {
            name: "play",
            description: "Play a song",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "query",
                    description: "The query/url for the song/playlist",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "pause",
            description: "Pause the current song",
            type: "SUB_COMMAND"
        },
        {
            name: "resume",
            description: "Resume the current song",
            type: "SUB_COMMAND"
        },
        {
            name: "skip",
            description: "Skip the current song",
            type: "SUB_COMMAND"
        },
        {
            name: "stop",
            description: "Stop the current song",
            type: "SUB_COMMAND"
        },
        {
            name: "volume",
            description: "Change the volume of the current song",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "volume",
                    description: "The volume you want to set the song to",
                    type: "NUMBER",
                    required: true
                }
            ]
        },
        {
            name: "queue",
            description: "View the current queue",
            type: "SUB_COMMAND"
        },
        {
            name: "shuffle",
            description: "Shuffle the current queue",
            type: "SUB_COMMAND"
        },
        {
            name: "bassboost",
            description: "Have fun with your ears",
            type: "SUB_COMMAND"
        },
        {
            name: "loop",
            description: "Loop the current song",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "queue_mode",
                    description: "The mode you want to set the loop to",
                    type: "INTEGER",
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
                const string = await interaction.options.getString("query", true);

                const guildQueue = client.player.getQueue(interaction.guild.id);

                const channel = interaction.member?.voice?.channel;

                if (!channel)
                    return interaction.reply("You have to join a voice channel first.");
                
                if (channel.type === "GUILD_STAGE_VOICE") {
                    return interaction.reply("You can't play music in a stage channel.");
                }

                if (guildQueue) {
                    if (channel.id !== interaction.guild.me?.voice?.channelId)
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

                let result = await client.player.search(string, { requestedBy: interaction.user }).catch(() => { });
                if (!result || !result.tracks.length)
                    return interaction.reply(`No result was found for \`${string}\`.`);
                
                if (guildQueue) {
                    queue = guildQueue;
                    queue.metadata = interaction;
                } else {
                    queue = await client.player.createQueue(interaction.guild, {
                        metadata: interaction
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
                    embed.addField("Now Playing", `[${queue.nowPlaying().title}](${queue.nowPlaying().url})`);
                }
                embed.setTitle("Queue")
                    .setFooter({ text: `${queue.tracks.length} songs in the queue` });
                for (let i = 0; i < 10; i++) {
                    const song = queue.tracks[i];
                    if (!song) break;
                    embed.addField(`${i + 1}. ${song.title}`, `Duration: ${song.duration}`);
                }
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