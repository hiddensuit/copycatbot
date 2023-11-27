module.exports = {
  names: ["copycollection", "cc", "copycat"],
  args: ["<mode>"],
  description: "grabs a tofu collection. currently has two modes: normal format (default), fusionboard <tf>",
  callback: async ({ client, message, type }) => {
    let startMsg = message.channel.send(`send a tofu collection${type ? `   || mode: ${type} ||` : ""}`);

    let codesArray = [];
    let pos = 49;
    let delimiter = "\n\n";
    let x = 50;

    if (type == "tf") {
      pos = 2;
      delimiter = "\n";
      x = pos;
    }

    function getCodes(collectionMsg) {
      let codes = [];

      for (const l of collectionMsg.embeds[0].data.description.split(`\n`)) {
        codes.push(l.split(" · ").slice(2).shift().replaceAll("`", " ").trim());
      }

      return codes;
    }

    const filter = (m) => m.author.id === "792827809797898240" && m.embeds[0];

    await message.channel
      .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
      .then((cArray) => {
        const c = cArray.first();

        if (!c.embeds[0].data.author.name.includes("Card Collection"))
          return message.channel.send("send a collection next time");

        codesArray.push(...getCodes(c));

        while (pos < codesArray.length) {
          codesArray[pos] += delimiter;
          pos += x + 1;
        }

        for (let i = 0; i < codesArray.length; i++) {
          if (!codesArray[i].includes("\n")) codesArray[i] += " ";
        }

        m.channel.send(codesArray.join("")).then(async (cm) => {
          await client.on("messageUpdate", (oldM, newM) => {
            if (c.id != oldM.id) return;

            const newCodes = getCodes(newM);

            if (codesArray.includes(newCodes[0])) return;

            codesArray.push(...newCodes);

            while (pos < codesArray.length) {
              codesArray[pos] += delimiter;
              pos += x + 1;
            }

            for (let i = 0; i < codesArray.length; i++) {
              if (!codesArray[i].includes("\n")) codesArray[i] = codesArray[i].trim() + " ";
            }

            cm.edit(codesArray.join(""));
          });
        });
      })
      .catch((c) => {
        if (codesArray[0]) return;
        return startMsg.edit("no collection was provided within 30 seconds..");
      });
  },
};
