const discord = require("discord.js")

const client = new discord.Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildVoiceStates",
        "MessageContent"
    ]
})

const { DisTube, default: dist } = require("distube") 
const {SpotifyPlugin } = require("@distube/spotify");

client.DisTube = new DisTube(client, {
  searchSongs: 5,
  searchCooldown: 30,
  leaveOnStop: false,
  leaveOnFinish: false,
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()],
})


client.on("ready", client => {
    console.log("Bot is ONLINE!")
})

client.on("messageCreate", message => {
    console.log(message)
    if (message.author.bot || !message.guild) return;
    const prefix = "?"
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift();


    if (message.content.toLowerCase().startsWith("prefix")) return;

    if (command.toLowerCase() === "play" || command.toLowerCase() === "p"){
        client.DisTube.play(message.member.voice.channel, args.join(" "), {
            member: message.member,
            textChannel: message.channel,
            message
        })
        message
    }
    if(command === "stop" || command === "s"){
        client.DisTube.stop(message)
        message.channel.send("Music has come to a halt!");
    }
    if(command === "leave" || command === "l"){
        client.DisTube.voices.get(message)?.leave();
        message.channel.send("Say peace!");
    }

    if (command == "jump"){
        client.DisTube.jump(message, parseInt(args[0]))
            .catch(err => message.channel.send("Invalid Number"));
    }

    if( command === "resume" || command === "r") client.DisTube.resume(message);

    if( command === "pause") client.DisTube.pause(message);

    if( command === "skip") client.DisTube.skip(message);

    if(command == 'queue' || command === "q"){
        const queue = client.DisTube.getQueue(message);
       // console.log(client.DisTube.getQueue(message))
        if(!queue){
            message.channel.send('Nothing in the Q E U E');
        }else {
			message.channel.send(
				`Current queue:\n${queue.songs
					.map(
						(song, id) =>
							`**${id ? id : 'Playing'}**. ${
								song.name
							} - \`${song.formattedDuration}\``,
					)
					.slice(0, 10)
					.join('\n')}`,
			);
		}
    }

})

client.DisTube.on("playSong", (queue, song) => {
    queue.textChannel.send("NOW PLAYING " + song.name)
})


client.DisTube.on("addSong", (queue, song) => 
    queue.textChannel?.send(`${song.user} added this shitty song ${song.name} - It's gonna be a tough \`${song.formattedDuration}\``,
    ),
)

client.DisTube.on('error', (textChannel, e) => {
    console.error(e);
    textChannel.send(
        `Welp. Something went wrong: ${e.message.slice(0, 2000)}`,
    );
})


client.DisTube.on('searchResult', (message, result) => {
    let i = 0;
    message.channel.send(
        `**Choose one of these daddy uwu**\n${result
            .map(
                song =>
                    `**${++i}**. ${song.name} - \`${
                        song.formattedDuration
                    }\``,
            )
            .join(
                '\n',
            )}\n*Enter something else or wait 30 seconds and you'll lose it!*`,
    );
})
client.DisTube.on('finish', queue => queue.textChannel?.send('Finish queue!'))

client.DisTube.on('finishSong', queue =>
    queue.textChannel?.send('Finish song!'),
)

client.DisTube.on('searchCancel', message =>
    message.channel.send('Bruh... you took too long...'),
)

client.DisTube.on('searchInvalidAnswer', message =>
    message.channel.send('Nope. Not enough results.'),
)

client.DisTube.on('searchNoResult', message =>
    message.channel.send('Try looking elswhere, comrade'),
)

client.DisTube.on('searchDone', () => {});

require('dotenv').config();
const token = process.env.DISCORD_TOKEN;

client.login(token)