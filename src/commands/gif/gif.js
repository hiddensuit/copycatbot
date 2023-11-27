const { PermissionFlagsBits } = require("discord.js");
const tensify = require("tensify");

module.exports = {
  names: ["*(gif category)*"],
  description: "displays a gif",
  hide: true,
  callback: async ({ message, command, db }) => {
    const target = message.mentions.users.first();

    if (!target) return message.channel.send(`u needa ping someone to ${command}`);

    const category = await db.GIF_Category.findOne({ where: { name: command }, include: db.GIF_URLS });
    if (!category || !category.GIF_URLs[0]) return;

    const gif = category.GIF_URLs[Math.floor(Math.random() * category.GIF_URLs.length)];
    let embed = {
      title: `${message.author.username} ${await tensify(category.name).past} ${target.username}!`,
      image: {
        url: gif.url,
        proxy_url: gif.url,
      },
    };

    (embed.width = 1000), (embed.height = 1000);

    return message.channel.send({
      embeds: [embed],
    });
  },
};
