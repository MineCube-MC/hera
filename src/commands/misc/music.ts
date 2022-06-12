import { Command } from "../../structures/Command";
import { client } from "../..";
import { QueryType, Queue } from "discord-player";
import { title, description, createdBy, features, credits, links } from "../../../assets/locale.json";
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
                    name: "type",
                    description: "The type of query to use",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "song",
                            value: "song"
                        },
                        {
                            name: "playlist",
                            value: "playlist"
                        },
                        {
                            name: "album",
                            value: "album"
                        }
                    ]
                },
                {
                    name: "url",
                    description: "The url of the song/playlist from Spotify",
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
            name: "clear",
            description: "Clear the current queue",
            type: "SUB_COMMAND"
        },
        {
            name: "shuffle",
            description: "Shuffle the current queue",
            type: "SUB_COMMAND"
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
                queue = await client.player.createQueue(interaction.guild);
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);

                embed = new MusicEmbed()
                let url = args.getString("url");

                if (args.getString("type") === "song") {
                    const result = await client.player.search(url, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.SPOTIFY_SONG
                    });
                    if (!result || !result.tracks.length) {
                        return interaction.reply("No results found");
                    }

                    const song = result.tracks[0];
                    try {
                        const youtubeResult = await client.player.search(song.url, {
                            requestedBy: interaction.user
                        });

                        if (!youtubeResult || !youtubeResult.tracks.length) {
                            return interaction.reply("No corresponding results found");
                        }

                        await queue.addTrack(youtubeResult.tracks[0]);
                    } catch (e) {
                        if (process.env.environment === "dev" || process.env.environment === "debug") {
                            console.error(e);
                        }
                        return interaction.reply("We can't play that song from Spotify.");
                    }

                    embed
                        .setTitle("Queue updated")
                        .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                        .setThumbnail(song.thumbnail)
                        .setFooter({ text: `Duration: ${song.duration} | Music offered by Spotify`, iconURL: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/571e5943-4616-4654-bf99-10b3c98f8686/d98301o-426f05ca-8fe5-4636-9009-db9dd1fca1f3.png" });
                } else if (args.getString("type") === "playlist") {
                    const result = await client.player.search(url, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.SPOTIFY_PLAYLIST
                    });
                    if (!result || !result.tracks.length) {
                        return interaction.reply("No results found");
                    }
                    const playlist = result.playlist;
                    try {
                        await queue.addTracks(result.tracks);
                    } catch (e) {
                        if (process.env.environment === "dev" || process.env.environment === "debug") {
                            console.error(e);
                        }
                        return interaction.reply("We can't add some tracks from the playlist.");
                    }
                    embed
                        .setTitle("Queue updated")
                        .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been successfully added to the Queue.`)
                        .setThumbnail(playlist.thumbnail);
                } else if (args.getString("type") === "album") {
                    const result = await client.player.search(url, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.SPOTIFY_ALBUM
                    });
                    if (!result || !result.tracks.length) {
                        return interaction.reply("No results found");
                    }
                    const playlist = result.playlist;
                    try {
                        await queue.addTracks(result.tracks);
                    } catch (e) {
                        if (process.env.environment === "dev" || process.env.environment === "debug") {
                            console.error(e);
                        }
                        return interaction.reply("We can't add some tracks from the playlist.");
                    }
                    embed
                        .setTitle("Queue updated")
                        .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been successfully added to the Queue.`)
                        .setThumbnail(playlist.thumbnail);
                }

                if (!queue.playing) await queue.play();

                await interaction.reply({
                    embeds: [embed]
                });
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
                    .setFooter({ text: `${queue.tracks.length} songs in the queue | Music offered by Spotify`, iconURL: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/571e5943-4616-4654-bf99-10b3c98f8686/d98301o-426f05ca-8fe5-4636-9009-db9dd1fca1f3.png" });
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
        }
    }
});