const { MessageAttachment } = require('discord.js');
const ytdl = require('ytdl-core');
const express = require("express");
const app = express();
const fs = require('fs');

module.exports = {
  options: {
    name: 'download',
    aliases: [ 'yt-download', 'yt-d' ],
    category: 'Public',
    requiredPerm: false
  },
  run: async (MessageEmbed, client, message, args, env, prefix, servers) => {
    const url = ytdl.validateURL(args[0]) ? args[0] : null;
    const vidId = ytdl.getVideoID(url);
    const video = await ytdl.getInfo(vidId);
    const thumbnail = video.videoDetails.thumbnails[video.videoDetails.thumbnails.length - 1].url;
    
    let itag;
    
    if (!url) {
      return message.channel.send(`Video not found`);
    }
    let link = `https://nmusik.glitch.me/download?url=`;
    link += url;
    
    let qual = '';
    let s
    
    for (var i=0; i<video.formats.length;i++) {
      if (video.formats[i].qualityLabel !== null) {
        qual += `**[${parseInt(i)+1}]:** \`${video.formats[i].container} - ${video.formats[i].qualityLabel}\`\n`;
        s = i+1;
      }
    }
    qual += `\n**Choose a number beetwen \`1-${s}\`**`;
    
    let embed = new MessageEmbed()
    .setColor("RED")
    .setTitle(`${video.videoDetails.title}`)
    .setURL(url)
    .setThumbnail(thumbnail)
    .setDescription(`**Select Video Quality**\n\n${qual}`)
    message.channel.send(embed);
    
    const filter = m => !isNaN(m.content) && m.content < s+1 && m.content > 0;
    const collector = message.channel.createMessageCollector(filter);

    collector.quality = video.formats;

    collector.once('collect', function(m) {
      let selected = this.quality[parseInt(m.content)-1].itag;
      link += `&itag=${selected}`;
      message.channel.send(link);
    });
  }
}