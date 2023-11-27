const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  names: ["removeuser"],
  testOnly: true,
  devOnly: true,
  hide: true,
  callback: async ({ message, args, db }) => {
    if (args.length != 1) return;

    const user = await db.User.findOne({ where: { id: args[0] } });
    if (!user) return;

    const accept = new ButtonBuilder().setCustomId("accept").setLabel("Yes").setStyle(ButtonStyle.Success);
    const cancel = new ButtonBuilder().setCustomId("cancel").setLabel("No").setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().setComponents(accept, cancel);

    const collector = await message.channel
      .send({
        content: `Are you 100% sure want to delete <@${user.id}> ?`,
        components: [row],
      })
      .then((m) => {
        return m.createMessageComponentCollector({ idle: 45_000, max: 1 });
      });

    collector.on("collect", async (i) => {
      if (i.customId === "cancel") return i.update({ content: "cancelled operation" });

      await user
        .destroy()
        .then(() => {
          return i.update({ content: `deleted user: \`${args[0].toLowerCase()}\` ...`, components: [] });
        })
        .catch((e) => {
          console.error(e);
          return message.channel.send("there was an error while deleting that user");
        });
    });
  },
};
