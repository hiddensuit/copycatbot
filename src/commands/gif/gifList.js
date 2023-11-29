const { PermissionFlagsBits } = require("discord.js");
const capitalize = require("../../utils/capitalize");

module.exports = {
  names: ["gl", "giflist", "gifs"],
  args: ["optional=<category/gifurl>"],
  description: "get a list of all gif categorys and # of urls",
  devOnly: true,
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

    for (var i = 0; i < categories.length; i++) {
      let catDesc = {};
      catDesc.name = `**${capitalize(categories[i].name)}**`;
      catDesc.value = `${
        categories[i].GIF_URLs[0] ? `${categories[i].GIF_URLs.length} URLs` : "*No URLs...*"
      }`;
      catDesc.inline = true;

      desc.push(catDesc);
    }

    const embed = {
      color: 0x3b83b2,
      author: {
        name: "copycatbot",
      },
      title: "List of GIF Categorys",
      fields: desc,
    };

    message.channel.send({ embeds: [embed] });
  },
};
