const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = {
  names: ["help"],
  callback: ({ client, message }) => {
    const commands = getLocalCommands("commands");

    const fields = [];

    for (command of commands) {
      if (command.names[0] === "help") continue;

      fields.push({
        name: `**${command.names[0]}**${
          command.names.slice(1)[0] ? ` - (*${command.names.slice(1).join(", ")}*)` : " "
        }`,
        value: command.description ? command.description : "*No description...*",
      });
    }

    const embed = {
      color: 0x3b83b2,
      author: {
        name: "copycat commands",
      },
      title: "Commands",
      fields: fields,
    };

    message.channel.send({ embeds: [embed] });
  },
};
