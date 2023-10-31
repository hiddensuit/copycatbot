const updateCollection = require("../../utils/updateCollection");

module.exports = async (client, m) => {
  let startMsg;

  if (m.content.toLowerCase() != "cc") return;
  m.channel.send("send a tofu collection").then((message) => {
    startMsg = message;
  });

  let codesArray = [];
  let pos = 50;

  function getCodes(collectionMsg) {
    let codes = [];

    for (const l of collectionMsg.embeds[0].data.description.split(`\n`)) {
      codes.push(l.split(" · ").slice(2).shift().replaceAll("`", " ").trim());
    }

    return codes;
  }

  const filter = (message) =>
    message.author.id === "792827809797898240" && message.embeds[0];

  await m.channel
    .awaitMessages({ filter, max: 1, time: 15_000, errors: ["time"] })
    .then((cArray) => {
      const c = cArray.first();

      if (!c.embeds[0].data.author.name.includes("Card Collection"))
        return m.channel.send("send a collection next time");

      codesArray.push(...getCodes(c));

      m.channel.send(codesArray.join(" ")).then((cm) => {
        updateCollection(client, c, codesArray, getCodes, cm, pos);
      });
    })
    .catch((c) => {
      if (codesArray[0]) return;
      return startMsg.edit("no collection was provided within 15 seconds..");
    });
};
