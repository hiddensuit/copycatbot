const numberWithCommas = require("../../utils/numberComma");

module.exports = {
  names: ["profile", "p"],
  callback: async ({ client, message, args, db }) => {
    let user;
    let searchId = args[0] ? args[0] : "";
    if (message.mentions.users.first())
      user = await db.User.findOne({ where: { id: message.mentions.users.first().id } });
    if (!user) user = await db.User.findOne({ where: { id: searchId } });
    if (!user) user = await db.User.findOne({ where: { id: message.author.id } });

    const discUser = await client.users.fetch(user.id);

    const embed = {
      color: 0x3b83b2,
      author: {
        name: "copycat profile",
        icon_url: discUser.avatarURL(),
      },
      title: discUser.globalName + `'s Profile`,
      url: "https://github.com/hiddensuit/copycatbot",
      thumbnail: {
        url: discUser.avatarURL(),
      },
      description: "",
      footer: {
        text: "adding more stuff...",
      },
    };

    //prettier-ignore
    let desc = [];

    // desc.push(`***name*** • ${} ::`);

    const { count } = await db.GIF_URLS.findAndCountAll({
      where: {
        userId: user.id,
      },
    });

    desc.push(`***blueberries*** • ${numberWithCommas(user.balance)} 🫐`);
    desc.push(`***gym points*** • ${numberWithCommas(user.gymPoints)} :military_medal: `);
    desc.push(`***xp*** • ${numberWithCommas(user.xp)} :sparkle:\n`);
    if (user.lastDaily) {
      desc.push(
        `***daily*** • ${
          user.lastDaily.toDateString() === new Date().toDateString() ? "*Claimed*" : "**Ready!**"
        }`
      );
    } else desc.push(`***daily*** • **Ready!**`);
    desc.push(`***max gifs*** • ${count}/${numberWithCommas(user.gifLimit)}`);

    user.bio
      ? desc.push(`\n\`\`\`${user.bio}\`\`\``)
      : desc.push("\n```use 'cc bio <your bio!>' to set a bio!\n```");

    embed.description = desc.join("\n");

    message.channel.send({ embeds: [embed] });
  },
};
