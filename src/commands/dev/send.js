module.exports = {
  names: ["send", "copy"],
  description: "mimics what the user said. (dev only)",
  devOnly: true,
  hide: true,
  callback: ({ message }) => {
    const content = message.content.substring(7).length > 0 ? message.content.substring(7) : "lol";
    message.channel.send(content);
  },
};
