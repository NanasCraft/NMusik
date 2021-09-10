module.exports = {
  options: {
    name: 'invite',
    aliases: [],
    category: 'Public',
    requiredPerm: false
  },
  run: async (MessageEmbed, client, message, args, env, prefix, servers) => {
    let embed = new MessageEmbed()
    .setColor('GOLD')
    .addField(`Invite Link`,`[Click Here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&response_type=code&scope=guilds.join%20bot%20guilds)`);
    message.channel.send(embed);
  }
}