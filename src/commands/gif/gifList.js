const { PermissionFlagsBits } = require("discord.js");
const capitalize = require("../../utils/capitalize");

module.exports = {
  names: ["gl", "giflist"],
  description: "get a list of all gif categorys and # of urls",
  testOnly: true,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async ({ message, args, db }) => {
    const desc = [];
    const desc2 = [];

    if (args[0]) {
      const category = await db.GIF_Category.findOne({
        where: { name: args[0].toLowerCase() },
        attributes: ["name"],
        include: db.GIF_URLS,
      });

      if (!category) return;

      for (gif of category.GIF_URLs) desc2.push(`\`${gif.url}\``);

      return message.channel.send({
        embeds: [
          {
            color: 0x3b83b2,
            author: {
              name: "copycatbot",
            },
            title: `URLs of ${category.name}`,
            description: desc2[0] ? desc2.join("\n") : "*No URls...*",
          },
        ],
      });
    }

    const categories = await db.GIF_Category.findAll({ attributes: ["name"], include: db.GIF_URLS });

    for (category of categories) {
      desc.push(`
        **${capitalize(category.name)}** - *${
        category.GIF_URLs[0] ? `${category.GIF_URLs.length} URLs` : "No URLs..."
      }*`);
    }

    const embed = {
      color: 0x3b83b2,
      author: {
        name: "copycatbot",
      },
      title: "List of GIF Categorys",
      description: desc.join("\n"),
    };

    message.channel.send({ embeds: [embed] });
  },
};
