module.exports = {
  names: ["send", "copy"],
  description: "mimics what the user said. (dev only)",
  devOnly: true,
  hide: true,
  callback: ({ message }) => {
    message.channel.send(message.content.substring(7));
  },
};
