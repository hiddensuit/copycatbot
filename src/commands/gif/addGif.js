const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  names: ["gifadd", "ga", "gifcreate"],
  description: "add a new gif url to a category.",
  args: ["<gifurl>"],
  testOnly: true,
  devOnly: true,
  callback: async ({ message, args, db }) => {
    if (!args[0] || args.length < 2) return message.channel.send("provide a category");

    const category = await db.GIF_Category.findOne({ where: { name: args.shift().toLowerCase() } });
    if (!category)
      return message.channel.send("category does not exist, make sure you are listing the category first.");

    const gifURL = args.shift().toLowerCase();

    try {
      let [gif, created] = await db.GIF_URLS.findOrCreate({
        where: { url: gifURL },
        defaults: { url: gifURL, GIFCategoryId: category.id, UserId: message.author.id },
        validate: true,
      });
      if (created)
        return message.channel.send(
          `the gif: \`${gif.url}\` has been successfully added under the category: \`${category.name}\``
        );
      return message.channel.send("that gif already exists");
    } catch (error) {
      console.error(error);
      return message.channel.send(
        "there was an error while adding that url to the database, make sure the url is formatted correctly"
      );
    }
  },
};
