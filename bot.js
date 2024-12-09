require("dotenv").config();
const { TOKEN, CHANNEL_ID_CF, GUILD_ID } = process.env;
const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildScheduledEvents,
    ],
});

// READY
client.once("ready", () => {
    const listLofi = [
        "https://www.youtube.com/watch?v=UqNYmgJpsuY"
    ];

    async function playLofiEndlessly() {
        while (true) {
            for (const lofi of listLofi) {
                try {
                    const player = createAudioPlayer();
                    const connection = joinVoiceChannel({
                        channelId: CHANNEL_ID_CF,
                        guildId: GUILD_ID,
                        adapterCreator: client.voice.createAdapterCreator(CHANNEL_ID_CF),
                    });

                    console.log("Playing lofi: ", lofi);

                    const stream = ytdl(lofi, {
                        filter: 'audioonly',
                        highWaterMark: 1 << 25,
                        requestOptions: {
                            headers: {
                                'User-Agent': 'Mozilla/5.0',
                            },
                        },
                        quality: 'highestaudio',
                    });

                    const resource = createAudioResource(stream);
                    player.play(resource);

                    connection.subscribe(player);

                    // Wait for the song to finish before playing next
                    await new Promise((resolve) => {
                        player.on('stateChange', (oldState, newState) => {
                            if (newState.status === 'idle') {
                                resolve();
                            }
                        });

                        player.on('error', (error) => {
                            console.error(`Playback error: ${error}`);
                            resolve();
                        });
                    });

                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    playLofiEndlessly();
});

client.login(TOKEN);
