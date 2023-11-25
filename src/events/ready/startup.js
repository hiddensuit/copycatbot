module.exports = (client) => {
  client.user.setPresence({
    activities: [{ name: "Jay Dee & Nujabes", type: 2 }],
    status: "dnd",
  });
  console.log(`\n${client.user.tag} is on\nstatus: ${client.user.presence.status}\n`);
};
