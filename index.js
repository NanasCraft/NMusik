const Discord = require("discord.js");
const { Client, MessageEmbed, Collection } = require("discord.js");
const client = new Client();
const ytdl = require('ytdl-core');
const fs = require('fs');

const { get } = require("snekfetch");
const http = require("http");
const express = require("express");
const app = express();
const env = process.env;

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.get("/download", async (request, response) => {
  const url = request.query.url;
  const itag = request.query.itag ? parseInt(request.query.itag) : 160;
  const vidId = ytdl.getVideoID(url);
  const video = await ytdl.getInfo(vidId);
  
  response.header("Content-Disposition",`attachment;\ filename="${video.videoDetails.title}.mp4"`)
  ytdl(url, { filter: format => format.itag === itag })
  .pipe(response);
});

app.get("/thanks", (req, res) =>{
  res.send("Thank you for using this bot");
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get("http://nmusic.glitch.me/");
}, 280000);

let bot = client;
const config = require("./config.json");

const prefix = config.prefix;

let working = 'Commands List: ';
let commands = fs.readdirSync('./commands/').filter(file => file.endsWith("js"));
for (var i = 0; i < commands.length; i++) {
  if (i !== commands.length-1) working += `${commands[i]}, `;
  if (i == commands.length-1) working += `${commands[i]}`;
}
console.log(working);

client.on("message", async message => {
  if (!message.guild || message.author.bot) return;
  if (!message.content.toLowerCase().startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  let servers = [];
  const voiceChannel = message.member.voice.channel;
  const connected = client.voice.connections.some(conn => conn.channel.id == voiceChannel.id);
  
  try {
    for (var i = 0; i < commands.length; i++) {
      let cmd = commands[i].replace(".js", "");
      const file = require(`./commands/${cmd}.js`);
      if (file.options.name==command || file.options.aliases==command && !file.options.disable==true) {
        file.run(MessageEmbed, client, message, args, env, prefix, servers);
      }
    }
  } catch (e) {
    console.log(e.message);
  } finally {
    console.log(`${message.author.tag} run the '${prefix}${command}' command in '${message.guild.name}' guild and in '${message.channel.name}' channel`);
  }
});

client.on("ready", () => {
  console.log(`${client.user.username} is now ready!`);
});

client.login(env.TOKEN);
