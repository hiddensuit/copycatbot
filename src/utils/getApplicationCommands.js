module.exports = async (client, guildId) => {
  let applicationCommands;

  if (guildId) {
    const guild = await client.guilds.feth(guildId);
    applicationCommands = guild.commands;
  } else {
    applicationCommands = await client.application.commands;
  }

  await applicationCommands.fetch();
  return applicationCommands;
};
