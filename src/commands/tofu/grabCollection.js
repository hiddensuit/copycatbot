module.exports = {
  names: ["copycollection", "cc", "copycat"],
  description: "grabs a tofu collection",
  callback: async (client, m, type) => {
    let startMsg;

    m.channel.send(`send a tofu collection${type ? `   || mode: ${type} ||` : ""}`).then((message) => {
      startMsg = message;
    });

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

    const filter = (message) => message.author.id === "792827809797898240" && message.embeds[0];

    await m.channel
      .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
      .then((cArray) => {
        const c = cArray.first();

        if (!c.embeds[0].data.author.name.includes("Card Collection"))
          return m.channel.send("send a collection next time");

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
