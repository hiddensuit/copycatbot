const path = require("path");
const getAllFiles = require("./getAllFiles");

module.exports = (dir = "commands_slash", exceptions = [], includeCategories = false) => {
  let localCommands = [];

  if (!includeCategories) {
    const commandCategories = getAllFiles(path.join(__dirname, "..", dir), true);

    for (const commandCategory of commandCategories) {
      const commandFiles = getAllFiles(commandCategory);

      for (const commandFile of commandFiles) {
        const commandObject = require(commandFile);

        if (exceptions.includes(commandObject.name)) continue;

        localCommands.push(commandObject);
      }
    }
  } else {
    const commandCategories = getAllFiles(path.join(__dirname, "..", dir), true);

    for (const commandCategory of commandCategories) {
      const categoryObj = {
        name: commandCategory.substring(31),
        commands: [],
      };
      const commandFiles = getAllFiles(commandCategory);

      for (const commandFile of commandFiles) {
        const commandObject = require(commandFile);

        if (exceptions.includes(commandObject.name)) continue;

        categoryObj.commands.push(commandObject);
      }
      localCommands.push(categoryObj);
    }
  }

  return localCommands;
};
