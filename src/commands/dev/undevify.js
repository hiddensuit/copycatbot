module.exports = {
  names: ["undevify"],
  testOnly: true,
  adminOnly: true,
  hide: true,
  callback: async ({ message, args, db }) => {
    if (!args[0]) return;

    const user = await db.User.findOne({ where: { id: args[0] } });

    if (!user) return;

    await user
      .update({ dev: false })
      .then(() => {
        return message.channel.send(`un-devified the user, <@${user.id}>`);
      })
      .catch((e) => {
        console.error(e);
        return message.channel.send("failed.");
      });
  },
};
