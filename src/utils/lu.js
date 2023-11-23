const months = require("../resources/months.json");
const capitalize = require("../utils/capitalize");
const { emojis } = require("../resources/acnh-data.json");

const lu = (item) => {
  const desc = [];

  for ([key, value] of Object.entries(item)) {
    if (key === "searchName" || key === "img" || value === "-") continue;
    if (key.includes("Months")) {
      const ms = value.split("-");
      const m = key === "northernMonths" ? "Northern Months" : "Southern Months";
      desc.push(`**${m}**: ${months[parseInt(ms[0])]} through ${months[parseInt(ms[1])]} 🗓️`);
      continue;
    }
    if (key === "bells") {
      desc.push(`**${capitalize(key, false)}**: ${value}  :bell:\n**Flick Price: ** ${value * 1.2} :bell:`);
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
      desc.push(`**${capitalize(key, false)}**: ${ms[0]} - ${ms[1]}`);
      continue;
    }
    if (key === "type") {
      desc.push(`**${capitalize(key, false)}**: ${capitalize(value, false)}  ${emojis.types[value]}`);
      continue;
    }

    desc.push(`**${capitalize(key, false)}**: ${capitalize(value.replace("-", " "))}`);
  }

  return {
    color: 0x3b83b2,
    author: {
      name: "Animal Crossing New Horizons Prices",
      iconURL:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Animal_Crossing_Leaf.svg/252px-Animal_Crossing_Leaf.svg.png",
    },
    thumbnail: {
      url: item.img,
    },
    title: capitalize(item.searchName),
    description: desc.join("\n"),
  };
};

module.exports = lu;
