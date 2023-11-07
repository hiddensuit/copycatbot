module.exports = {
  name: "ping",
  description: "pong",
  callback: (client, message) => {
    message.channel.send(`pong...${client.ws.ping}ms`);
  },
};
