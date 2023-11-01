const { devs, testServer, prefix } = require("../../../config.json");
const grabCollection = require("../../commands/grabCollection");

module.exports = async (client, message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);

  if (!args[0]) return grabCollection.callback(client, message);

  const command = args.shift().toLowerCase();

  if (command == "tf") return grabCollection.callback(client, message, "tf");
};
