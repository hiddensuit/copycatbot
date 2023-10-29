module.exports = async (client, m) => {
  if (m.content != "gtc") return;
  m.channel.send("send a tofu collection");

  let collection;

  const filter = (message) =>
    message.author.id === "792827809797898240" || message.embeds[0];

  await m.channel
    .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
    .then((c) => {
      collection = c.first();
    })
    .catch((c) => {
      if (collection) return;
      m.channel.send("no collection was provided within 30 seconds..");
    });

  if (!collection.embeds[0].data.author.name.includes("Card Collection"))
    return m.channel.send("pls send a collection next time");

  let codesArray = [];
  pos = 1;

  for (const l of collection.embeds[0].data.description.split(`\n`)) {
    codesArray.push(
      l.split(" · ").slice(2).shift().replaceAll("`", " ").trim()
    );
  }

  while (pos < codesArray) {
    array.splice(pos, 0, `\n`);
    pos += 50;
  }

  m.channel.send(codesArray.join(" "));
};
