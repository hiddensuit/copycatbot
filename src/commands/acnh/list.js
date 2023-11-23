const {
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

const { items, types, emojis } = require("../../resources/acnh-data.json");
const capitalize = require("../../utils/capitalize");
const comma = require("../../utils/numberComma");
const lu = require("../../utils/lu.js");

module.exports = {
  names: ["acprices", "acp"],
  description:
    "lists items by order of descending price (default). accepts one argument as the filter for the items types",
  callback: async (client, message, args) => {
    items.sort((a, b) => b.bells - a.bells);

    function embed(item) {
      let desc = [];

      if (item) return lu(item);

      for (i of results.slice(pos, pos + 10)) {
        desc.push(`:bell: ${comma(i.bells)} - **${capitalize(i.searchName)}** - ${emojis.types[i.type]}`);
      }

      return {
        color: 0x3b83b2,
        author: {
          name: "Animal Crossing New Horizons Prices",
          iconURL:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Animal_Crossing_Leaf.svg/252px-Animal_Crossing_Leaf.svg.png",
        },
        title: "Items listed by descending bell price.",
        description: desc.join("\n"),
        footer: { text: `Showing ${pos + 1} - ${pos + 10} of ${results.length}` },
      };
    }

    function select() {
      const menuOptions = [];

      for (i of results.slice(pos, pos + 10)) {
        menuOptions.push(
          new StringSelectMenuOptionBuilder().setLabel(capitalize(i.searchName)).setValue(i.searchName)
        );
      }

      return new StringSelectMenuBuilder()
        .setCustomId("selection")
        .setPlaceholder("make a selection")
        .addOptions(...menuOptions);
    }

    let pos = 0;
    let results = items;
    let type = "";

    if (args[0]) type = args.join("-").toLowerCase();

    if (types.includes(type))
      results = items.filter((i) => {
        return i.type === type || `${i.type}s` === type;
      });

    const start = new ButtonBuilder().setCustomId("start").setLabel("<<").setStyle(ButtonStyle.Secondary);
    const left = new ButtonBuilder().setCustomId("left").setLabel("<").setStyle(ButtonStyle.Secondary);
    const right = new ButtonBuilder().setCustomId("right").setLabel(">").setStyle(ButtonStyle.Secondary);
    const end = new ButtonBuilder().setCustomId("end").setLabel(">>").setStyle(ButtonStyle.Secondary);

    const selectRow = new ActionRowBuilder().setComponents(select());
    const row = new ActionRowBuilder().setComponents(start, left, right, end);

    const isabelle = await message.channel.createWebhook({
      name: "Isabelle",
      avatar: "https://pbs.twimg.com/profile_images/1481028496960884737/0TV2hqEf_400x400.jpg",
    });

    const response = await isabelle.send({
      embeds: [embed()],
      components: [selectRow, row],
    });

    const collector = response.createMessageComponentCollector({
      idle: 45_000,
    });

    collector.on("collect", (i) => {
      if (i.customId === "start") pos = 0;
      if (i.customId === "left" && pos >= 10) pos -= 10;
      if (i.customId === "right" && pos + 10 < results.length) pos += 10;
      if (i.customId === "end") pos = results.length - 10;
      if (i.customId === "selection")
        return i.update({
          embeds: [
            embed(
              items.find((item) => {
                return item.searchName === i.values[0];
              })
            ),
          ],
          components: [],
        });

      i.update({ embeds: [embed()], components: [selectRow.setComponents(select()), row] });
    });

    collector.on("end", (i) => {
      isabelle.editMessage(response.id, { components: [] });
      isabelle.delete();
    });
  },
};
