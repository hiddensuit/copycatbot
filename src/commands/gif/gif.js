const { PermissionFlagsBits } = require("discord.js");
const tensify = require("tensify");

module.exports = {
  names: ["*(gif category)*"],
  description: "displays a gif",
  testOnly: true,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async ({ message, command, db }) => {
    const target = message.mentions.users.first();

    if (!target) return message.channel.send(`u needa ping someone to ${command}`);

    const category = await db.GIF_Category.findOne({ where: { name: command }, include: db.GIF_URLS });
    if (!category) return;

    const gif = category.GIF_URLs[Math.floor(Math.random() * category.GIF_URLs.length)];

    return message.channel.send({
      embeds: [
        {
          title: `${message.author.username} ${await tensify(category.name).past} ${target.username}!`,
          image: {
            url: gif.url,
          },
        },
      ],
    });
  },
};
