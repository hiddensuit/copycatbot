const { PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  names: ["gifcategoryremove", "gcr", "gifcategorydelete"],
  args: ["<category>"],
  description: "remove a gif category (will not remove if category has gifs).",
  testOnly: true,
  devOnly: true,
  callback: async ({ message, args, db }) => {
    if (!args[0]) return message.channel.send("provide a category");

    const category = await db.GIF_Category.findOne({ where: { name: args[0].toLowerCase() } });

    if (!category) return message.channel.send("that category does not exist.");

    const accept = new ButtonBuilder().setCustomId("accept").setLabel("Yes").setStyle(ButtonStyle.Success);
    const cancel = new ButtonBuilder().setCustomId("cancel").setLabel("No").setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().setComponents(accept, cancel);

    const collector = await message.channel
      .send({
        content: `Are sure you want to delete \`${category.name}\`?`,
        components: [row],
      })
      .then((m) => {
        return m.createMessageComponentCollector({ idle: 45_000, max: 1 });
      });

    collector.on("collect", async (i) => {
      if (i.customId === "cancel") return i.update({ content: "cancelled operation" });

      await category.destroy().catch((e) => {
        console.error(e);
        return message.channel.send(
          "there was an error while deleting that category, btw u cant delete categories with gifs in em."
        );
      });

      return i.update({ content: `deleted category: \`${args[0].toLowerCase()}\`.`, components: [] });
    });
  },
};
