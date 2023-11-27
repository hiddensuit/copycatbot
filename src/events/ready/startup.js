module.exports = (client) => {
  client.user.setPresence({
    activities: [{ name: "Jay Dee & Nujabes", type: 2 }],
    status: "dnd",
  });
  // prettier-ignore

  console.log("\x1b[1;36m%s\x1b[0m", `\n${client.user.tag} is on`);
  console.log(
    "\x1b[5m%s\x1b[0m",
    `  activity: ${client.user.presence.activities}\n  status: ${client.user.presence.status}\n  ping: ${client.ws.ping}ms`
  );
};
