const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  names: ["gifcategoryadd", "gca"],
  description: "add a new gif category.",
  testOnly: true,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async ({ message, args, db }) => {
    if (!args[0] || args.length > 1) return message.channel.send("provide one category");

    const categoryName = args[0].toLowerCase();

    let [category, created] = await db.GIF_Category.findOrCreate({
      where: { name: categoryName },
      validate: true,
    }).catch((err) => {
      message.channel.send(`there was an error in updating that category to the database.`);
      return console.error(err);
    });

    if (created) return message.channel.send(`the category: \`${category.name}\` has been created`);

    return message.channel.send(`the category: \`${category.name}\` already exists.`);
  },
};
