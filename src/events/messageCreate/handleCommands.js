const { devs, testServer, prefix } = require("../../../config.json");
const db = require("../../../database/models/index");
const getLocalCommands = require("../../utils/getLocalCommands");
const grabCollection = require("../../commands/tofu/grabCollection");

module.exports = async (client, message) => {
  await db.User.findOrCreate({ where: { id: message.author.id } });
  if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);

  if (!args[0]) return grabCollection.callback(client, message);

  const command = args.shift().toLowerCase();

  const commands = getLocalCommands("commands");

  const categories = await db.GIF_Category.findAll();
  const names = [];
  for (category of categories) names.push(category.name);

  if (names.includes(command)) {
    const gif = require("../../commands/gif/gif");
    gif.callback({ client, message, args, db, command });
  }

  try {
    const commandObject = commands.find((cmd) => cmd.names.includes(command));

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
            content: "i do not have the required permissions to use this command",
            ephemeral: true,
          });
          return;
        }
      }
    }

    await commandObject.callback({ client, message, args, db, command });
  } catch (error) {
    console.error(error);
  }
};
