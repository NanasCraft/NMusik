const ytdl = require('ytdl-core');

module.exports = {
  options: {
    name: 'skip',
    aliases: [ 's' ],
    category: 'Music',
    requiredPerm: false
  },
  run: async (MessageEmbed, client, message, args, env, prefix, servers) => {
    const voiceChannel = message.member.voice.channel;
    const connected = client.voice.connections.some(conn => conn.channel.id == voiceChannel.id);

    var server = servers[message.guild.id];
    let connection = await voiceChannel.join();
    let dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));

    if (connected) {
      for(var i = server.queue.length -1; i >=0; i--) {
        server.queue.splice(i, 1);
        message.channel.send("**Successfully Skipped**");
      }
      server.dispatcher.end();
      message.channel.send("**Ending the queue.**");
    }
  }
}