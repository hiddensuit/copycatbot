const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  names: ["gifcategoryedit", "gce", "gifcategorymodify"],
  args: ["<oldCategory> <newCategory>"],
  description: "edit/modify a gif category.",
  examples: ["gce bully tease"],
  testOnly: true,
  devOnly: true,
  callback: async ({ message, args, db }) => {
    if (args.length < 2) return message.channel.send("provide a category");

    const oldCategory = await db.GIF_Category.findOne({ where: { name: args[0].toLowerCase() } });
    const newCategory = args[1].toLowerCase();

    if (!oldCategory) return message.channel.send("that category does not exist.");

    const accept = new ButtonBuilder().setCustomId("accept").setLabel("Yes").setStyle(ButtonStyle.Success);
    const cancel = new ButtonBuilder().setCustomId("cancel").setLabel("No").setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().setComponents(accept, cancel);

    const collector = await message.channel
      .send({
        content: `Are sure you want to change \`${oldCategory.name}\` to \`${newCategory}\`?`,
        components: [row],
      })
      .then((m) => {
        return m.createMessageComponentCollector({ idle: 45_000, max: 1 });
      });

    collector.on("collect", async (i) => {
      if (i.customId === "cancel") return i.update({ content: "cancelled operation" });

      await oldCategory.update({ name: newCategory }).catch((e) => {
        console.error(e);
        return message.channel.send("there was an error while modifying that category..");
      });

      return i.update({
        content: `edited, \`${args[0].toLowerCase()}\`'s new name is : \`${newCategory}\`.`,
        components: [],
      });
    });
  },
};
