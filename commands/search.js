module.exports = {
  options: {
    name: 'search',
    aliases: [],
    category: 'Music'
  },
  run: async (MessageEmbed, client, message, args, env, prefix, servers, db) => {
    const search = require('yt-search');
    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor("DARK_RED")
        .setAuthor("Something Wrong!")
        .setDescription("Please input some **Arguments** to play audio!")
        .setFooter("CelticCronze ● Server CelticStuff Teams 2020");
      message.channel.send(embed);
      return;
    }
    search(args.join(' '), function(err, res) {
      if (err) {
        let embed = new MessageEmbed()
          .setColor("RED")
          .setAuthor("Sorry, something went wrong.")
          .setFooter("CelticCronze ● Server CelticStuff Teams 2020");
        message.channel.send(embed);
        return;
      }

      let videos = res.videos.slice(0, 10);

      let resp = '';
      for (var i in videos) {
        resp += `**[${parseInt(i)+1}]:** \`${videos[i].title}\`\n`;
      }

      resp += `\n**Choose a number beetwen \`1-${videos.length}\`**`;

      let vid = new MessageEmbed()
      .setColor("RED")
      .setAuthor("Select to play audio")
      .setDescription(resp)
      .setFooter("CelticCronze ● Server CelticStuff Teams 2020");

      message.channel.send(vid);

      const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;
      const collector = message.channel.createMessageCollector(filter);

      collector.videos = videos;

      collector.once('collect', function(m) {
        let commandFile = require('./play.js');
        commandFile.run(MessageEmbed, client, message, [this.videos[parseInt(m.content)-1].url], env, prefix, servers);
      });
    });
  }
}