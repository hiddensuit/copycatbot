const { devs, testServer, prefix } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const grabCollection = require("../../commands/tofu/karuta/grabCollection");

module.exports = async (client, message) => {
  if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot)
    return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);

  if (!args[0]) return grabCollection.callback(client, message);

  const command = args.shift().toLowerCase();

  const commands = getLocalCommands("commands");

  try {
    const commandObject = commands.find((cmd) => cmd.name === command);

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(message.member.id)) {
        message.reply({
          content: "only devs can run this command",
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.testOnly) {
      if (!(message.guild.id === testServer)) {
        message.reply({
          content: "command is in testing",
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!message.member.permissions.has(permission)) {
          message.reply({
            content: "u dont have perms to run this command",
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = message.guild.members.me;

        if (!bot.permissions.has(permission)) {
          message.reply({
            content:
              "i do not have the required permissions to use this command",
            ephemeral: true,
          });
          return;
        }
      }
    }

    await commandObject.callback(client, message, args);
  } catch (error) {
    console.log(`there was an error running this command... ${error}`);
  }
};
