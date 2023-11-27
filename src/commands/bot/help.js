const getLocalCommands = require("../../utils/getLocalCommands");
const capitalize = require("../../utils/capitalize");

module.exports = {
  names: ["help", "h"],
  hide: true,
  callback: ({ message, args }) => {
    const commandCategories = getLocalCommands("commands", [], true);

    const search = args[0] ? args[0].toLowerCase() : false;

    const embed = {
      color: 0x3b83b2,
      author: {
        name: "copycat commands",
      },
      title: "Command Info",
      fields: [],
      description: "",
      footer: {
        text: `for more info about a category or command, go \`cc help (category/command)\``,
      },
    };

    let specifiedCat = false;
    let specifiedCommand = false;

    if (search) {
      specifiedCat = commandCategories.find((i) => {
        return i.name === search;
      });

      for (category of commandCategories) {
        const s = category.commands.find((c) => {
          return c.names.includes(search);
        });
        if (s) specifiedCommand = s;
      }
    }

    if (specifiedCat) {
      (embed.footer = {
        text: `for more info about a command, go \`cc help (command)\``,
      }),
        (embed.title = `${capitalize(specifiedCat.name)} Details`);
      for (command of specifiedCat.commands) {
        if (!command.hide) {
          embed.fields.push({
            name: `**${command.names[0]}**${
              command.names.slice(1)[0] ? ` - (*${command.names.slice(1).join(", ")}*)` : " "
            }`,
            value: command.description ? command.description : "*No description...*",
            inline: true,
          });
        }
      }
    } else if (specifiedCommand) {
      const aliases = specifiedCommand.names.slice(1);

      embed.title = `${capitalize(specifiedCommand.names[0])} Details`;
      embed.description = `\`\`\`${specifiedCommand.description}\`\`\``;
      embed.footer = {};

      if (aliases[0]) {
        embed.fields.push({
          name: "Aliases",
          value: aliases.join(", "),
        });
      }
      if (specifiedCommand.args) {
        embed.fields.push({
          name: "Options",
          value: `\`cc ${specifiedCommand.names[0]} ${specifiedCommand.args.join(" ")}\``,
        });
      }
    } else {
      for (category of commandCategories) {
        if (category.name === "dev") continue;

        let value = [];
        for (command of category.commands) {
          if (!command.hide) value.push(command.names[0]);
        }

        embed.fields.push({
          name: `${capitalize(category.name)} Commands`,
          value: value.join("\n"),
          inline: true,
        });
      }
    }

    return message.channel.send({ embeds: [embed] });
  },
};
