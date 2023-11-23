module.exports = {
  names: ["status"],
  description: "gets status of bot",
  callback: (client, message) => {
    message.channel.send(`\`\`\`
      activity: ${client.user.presence.activities}
      status: ${client.user.presence.status}
      ping: ${client.ws.ping}ms\`\`\``);
  },
};
