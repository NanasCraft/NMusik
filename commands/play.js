const ytdl = require('ytdl-core');

module.exports = {
  options: {
    name: 'play',
    aliases: [ 'p' ],
    category: 'Music',
    requiredPerm: false
  },
  run: async (MessageEmbed, client, message, args, env, prefix, servers, redirect) => {
    const voiceChannel = message.member.voice.channel;
    const connected = client.voice.connections.some(conn => conn.channel.id == voiceChannel.id);
    var isLoop = false;

    function play(connection, message) {
      var server = servers[message.guild.id];

      server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));

      // if (isLoop==false && server.queue.length() > 1) {
      //   server.queue.slice(1);
      //   server.requested.slice(1);
      // }
      server.dispatcher.on("end", function(){
        if (server.queue[0]) {
          play(connection, message);
        } else {
          connection.disconnect();
        }
      })
    }

    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor("DARK_RED")
        .setAuthor("Something Wrong!")
        .setDescription("Please input a **YouTube** link video!")
        .setFooter("CelticCronze - Server CelticStuff Teams 2020");
      message.channel.send(embed);
      return;
    }

    let validate = await ytdl.validateURL(args[0]);

    if (!message.member.voice) {
      let embed = new MessageEmbed()
        .setColor("DARK_RED")
        .setAuthor("Something Wrong!")
        .setDescription("You must join a **Voice Channel** first!")
        .setFooter("CelticCronze - Server CelticStuff Teams 2020");
      message.channel.send(embed);
      return;
    }

    let msg = await message.channel.send('Please wait..');

    let m = message

    if (!validate) {
      let commandFile = require(`./search.js`);
      commandFile.run(MessageEmbed, client, message, args, env, prefix, servers);
      msg.delete();
      return;
    }

    if (!servers[message.guild.id]) servers[message.guild.id] = {
      queue: [],
      requested: []
    }

    var server = servers[message.guild.id];

    server.queue.push(args[0]);
    server.requested.push(message.author.tag);
    
    // console.log(server);

    if (connected==false) {
      voiceChannel.join().then(function(connection){
        let embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor(`Playing an Audio`)
        .setTitle("Click to watch the video")
        .setDescription(`Playing audio from: \`${args[0]}\`\nRequested by: \`${message.author.tag}\``)
        .setFooter("CelticCronze - Server CelticStuff Teams 2020")
        .setURL(args[0]);
        msg.delete();
        message.channel.send(embed);
        play(connection, message);
      });
    }
  }
}