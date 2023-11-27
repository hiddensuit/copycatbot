const { PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  names: ["gifremove", "gr", "gifdelete"],
  args: ["<gifurl>"],
  description: "remove a gif url.",
  testOnly: true,
  devOnly: true,
  callback: async ({ message, args, db }) => {
    if (!args[0]) return message.channel.send("provide a gif");

    const gif = await db.GIF_URLS.findOne({ where: { url: args[0].toLowerCase() } });

    if (!gif) return message.channel.send("that gif does not exist.");

    const accept = new ButtonBuilder().setCustomId("accept").setLabel("Yes").setStyle(ButtonStyle.Success);
    const cancel = new ButtonBuilder().setCustomId("cancel").setLabel("No").setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().setComponents(accept, cancel);

    const collector = await message.channel
      .send({
        content: `Are you sure want to delete \`${gif.url}\`?`,
        components: [row],
      })
      .then((m) => {
        return m.createMessageComponentCollector({ idle: 45_000, max: 1 });
      });

    collector.on("collect", async (i) => {
      if (i.customId === "cancel") return i.update({ content: "cancelled operation" });

      await gif.destroy().catch((e) => {
        console.error(e);
        return message.channel.send("there was an error while deleting that gif");
      });

      return i.update({ content: `deleted gif: \`${args[0].toLowerCase()}\`.`, components: [] });
    });
  },
};
