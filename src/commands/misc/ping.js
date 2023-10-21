module.exports = {
  name: "ping",
  description: "pong",
  // devOnly: Boolean,
  // testOnly: Boolean,
  // optoins: Object[],

  callback: (client, interaction) => {
    interaction.reply(`pong...${client.ws.ping}ms`);
  },
};
