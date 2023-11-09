const acData = require("../../resources/acnh-data.json");
const capitalize = require("../../utils/capitalize");

const months = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

module.exports = {
  name: "aclu",
  testOnly: true,
  callback: async (client, message, search) => {
    if (!search[0])
      return message.channel.send("u didnt search for anything lol");

    const descArr = [];

    function embed(item) {
      for ([key, value] of Object.entries(item)) {
        if (key === "searchName" || key === "img" || value === "-") continue;
        if (key.includes("Months")) {
          const ms = value.split("-");
          descArr.push(
            `**${capitalize(key, false)}**: ${months[parseInt(ms[0])]} - ${
              months[parseInt(ms[1])]
            }`
          );
          continue;
        }
        if (key.includes("hours")) {
          const ms = value.split("-");
          let inc = 0;
          for (m of ms) {
            if (parseInt(m) > 12) ms[inc] = m - 12 + "PM";
            else ms[inc] = m + "AM";

            inc++;
          }
          descArr.push(`**${capitalize(key, false)}**: ${ms[0]} - ${ms[1]}`);
          continue;
        }

        descArr.push(
          `**${capitalize(key, false)}**: ${capitalize(
            value.replace("-", " ")
          )}`
        );
      }

      const embed = {
        color: 0x3b83b2,
        author: {
          name: "Animal Crossing New Horizons Price Lookup",
        },
        thumbnail: {
          url: item.img,
        },
        title: capitalize(item.searchName),
        description: descArr.join(`\n`),
      };

      return message.channel.send({ embeds: [embed] });
    }

    let i = acData.items.find((i) => {
      return i.searchName === search.join(" ").toLowerCase();
    });

    if (i) return embed(i);

    let filtered = [];
    let fNames = [];
    let f = (m) => typeof parseInt(m.content) === "number";
    let inc = 1;

    if (!i)
      for (s of search) {
        if (s.length > 2)
          filtered.push(
            ...acData.items.filter((i) => i.searchName.includes(s))
          );
      }
    if (filtered.length === 1) i = filtered[0];
    if (!filtered[0])
      return message.channel.send("not a valid item lol").then((m) => {
        setTimeout(() => m.delete(), 5000);
      });

    for (f of filtered) fNames.push(`${inc++}. ` + f.searchName);

    await message.channel.send({
      embeds: [
        {
          color: 0x3b83b2,
          author: {
            name: "Animal Crossing New Horizons Price Lookup",
          },
          title: "Select from the following using numbers.",
          description: fNames.join(`\n`),
        },
      ],
    });
    await message.channel
      .awaitMessages({ f, max: 1, time: 30_000, errors: ["time"] })
      .then((ms) => {
        const m = ms.first();

        embed(filtered[parseInt(m.content) - 1]);
      })
      .catch((e) => {
        message.channel
          .send("choose an option next time.")
          .then((m) => setTimeout(() => m.delete(), 5000));
      });
  },
};
