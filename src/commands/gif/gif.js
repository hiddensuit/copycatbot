const { PermissionFlagsBits } = require("discord.js");
const tensify = require("tensify");

module.exports = {
  names: ["*(gif category)*"],
  description: "displays a gif",
  hide: true,
  callback: async ({ message, command, db }) => {
    const category = await db.GIF_Category.findOne({ where: { name: command }, include: db.GIF_URLS });
    if (!category || !category.GIF_URLs[0]) return;
    const gif = category.GIF_URLs[Math.floor(Math.random() * category.GIF_URLs.length)];
    const target = message.mentions.users.first();

    let embed = {
      title: `${message.author.globalName} used *cc ${command}*!`,
      image: {
        url: gif.url,
        proxy_url: gif.url,
      },
    };

    if (!target) return message.channel.send({ embeds: [embed] });

    embed.title = `${message.author.username} ${await tensify(category.name).past} ${target.username}!`;

    return message.channel.send({ embeds: [embed] });
  },
};
