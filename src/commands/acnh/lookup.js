const acData = require("../../resources/acnh-data.json");
const capitalize = require("../../utils/capitalize");
const embed = require("../../utils/lu.js");

module.exports = {
  names: ["aclookup", "aclu", "acsearch", "acs"],
  args: ["<item>"],
  description: "look up an item from animal crossing new horizons.",
  callback: async ({ message, args }) => {
    const isabelle = await message.channel.createWebhook({
      name: "Isabelle",
      avatar: "https://pbs.twimg.com/profile_images/1481028496960884737/0TV2hqEf_400x400.jpg",
    });

    if (!args[0]) return message.channel.send("u didnt search for anything lol");

    let i = acData.items.find((i) => {
      return i.searchName === args.join(" ").toLowerCase();
    });

    if (!i)
      return message.channel.send("not a valid item lol").then((m) => {
        setTimeout(() => m.delete(), isabelle.delete(), 5000);
      });

    return isabelle.send({ embeds: [embed(i)] }).then(() => setTimeout(() => isabelle.delete(), 3000));
  },
};
