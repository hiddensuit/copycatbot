module.exports = {
  names: ["setbalance"],
  testOnly: true,
  devOnly: true,
  hide: true,
  callback: async ({ message, args, db }) => {
    if (args.length != 2) return;

    const user = await db.User.findOne({ where: { id: args[0] } });
    const amt = typeof parseInt(args[1]) === "number" ? parseInt(args[1]) : null;
    const operation = args[1][0];

    if (!user || !amt) return;

    if (operation === "+") {
      user.balance = user.balance + amt < 0 ? 0 : user.balance + amt;
    } else if (operation === "-") {
      user.balance = user.balance + amt < 0 ? 0 : user.balance + amt;
    } else {
      user.balance = amt < 0 ? 0 : amt;
    }

    await user
      .save()
      .then(() => {
        return message.channel.send(`updated user \`${user.id}\`'s balance to: \`${user.balance}\``);
      })
      .catch((e) => {
        console.error(e);
        return message.channel.send("failed.");
      });
  },
};
