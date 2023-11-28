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
      title: "Command Categories",
      fields: [],
      description: "",
      footer: {
        text: `for more info about a category, do 'cc help (category)'`,
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
      let desc = [];
      embed.footer = {
        text: `for more info about a command, go \`cc help (command)\``,
      };
      embed.title = `${capitalize(specifiedCat.name)} Details`;

      //prettier-ignore

      for (command of specifiedCat.commands) {
        if (command.hide) continue;

        desc.push(`__**${command.names[0]}**__ ${command.names.slice(1)[0] ? ` (*${command.names.slice(1).join(", ")}*)` : " "}`
        );
        specifiedCommand.examples ? embed.footer = { text: `ex: 'cc ${specifiedCommand.examples.join("',   'cc ")}'`} : false;
        command.description ? desc.push(`\`\`\`${command.description}\`\`\``) : "*No description...*";
      }

      embed.description = desc.join("\n");
    } else if (specifiedCommand) {
      embed.title = `${capitalize(specifiedCommand.names[0])} Info`;
      embed.footer = specifiedCommand.examples
        ? { text: `ex: 'cc ${specifiedCommand.examples.join("',   'cc ")}'` }
        : {};

      let desc = [];
      const aliases = specifiedCommand.names.slice(1);

      if (aliases[0]) desc.push(`***Aliases***: \`${aliases.join("`, `")}\``);
      if (specifiedCommand.args)
        desc.push(`***Options***: \`cc ${specifiedCommand.names[0]} ${specifiedCommand.args.join(" ")}\``);
      desc.push(`\n**Command Description**\`\`\`${specifiedCommand.description}\`\`\``);

      embed.description = desc.join("\n");
    } else {
      let desc = [];
      for (category of commandCategories) {
        if (category.name === "dev") continue;
        desc.push(`• **${category.name}**`);
      }
      embed.description = desc.join("\n");
    }

    return message.channel.send({ embeds: [embed] });
  },
};
