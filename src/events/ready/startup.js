module.exports = (client) => {
  client.user.setPresence({ status: "dnd" });
  console.log(
    `\n${client.user.tag} is on\nstatus: ${client.user.presence.status}\n`
  );
};
