module.exports = {
  names: ["daily", "d"],
  examples: ["cc daily", "cc d"],
  callback: async ({ message, db }) => {
    const user = await db.User.findOne({ where: { id: message.author.id } });
    const currentDate = new Date();

    const dailyAmt = 10;

    async function tenDaily() {
      user.balance += dailyAmt;
      user.lastDaily = new Date();

      return await user
        .save()
        .then(() => {
          return message.channel.send(`you have recieved your 10 daily blueberries :blueberries: !`);
        })
        .catch((e) => {
          console.error(e);
          return message.channel.send("oops, couldnt give you your daily idk y");
        });
    }

    if (!user.lastDaily) return tenDaily();
    if (user.lastDaily.toDateString() === currentDate.toDateString())
      return message.channel.send("you have already claimed your daily today!");

    tenDaily();
  },
};
