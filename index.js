const discord = require("discord.js")

const client = new discord.Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildVoiceStates",
        "MessageContent"
    ]
})

const { DisTube } = require("distube") 

client.DisTube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
})


client.on("ready", client => {
    console.log("Bot is ONLINE!")
})

client.on("messageCreate", message => {
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
    }
    if(command === "stop" || command === "s"){
        client.DisTube.stop(message)
        message.channel.send("Music has come to a halt!");
    }
    if(command === "leave" || command === "l"){
        client.DisTube.voices.get(message)?.leave();
        message.channel.send("Say peace!");
    }

    if( command === "resume" || command === "r") client.DisTube.resume(message);

    if( command === "pause") client.DisTube.pause(message);

    if( command === "skip") client.DisTube.skip(message);

    if(command == 'queue' || command === "q"){
        const queue = client.DisTube.getQueue(message);
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

require('dotenv').config();
const token = process.env.DISCORD_TOKEN;

client.login(token)