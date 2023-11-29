module.exports = {
  names: ["devify"],
  testOnly: true,
  adminOnly: true,
  hide: true,
  callback: async ({ message, args, db }) => {
    if (!args[0]) return;

    const user = await db.User.findOne({ where: { id: args[0] } });

    if (!user) return;

    await user
      .update({ dev: true })
      .then(() => {
        return message.channel.send(`devified the user, <@${user.id}>`);
      })
      .catch((e) => {
        console.error(e);
        return message.channel.send("failed.");
      });
  },
};
