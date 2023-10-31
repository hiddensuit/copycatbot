module.exports = async (client, message, collection, getCodes, cm, pos) => {
  await client.on("messageUpdate", (oldM, newM) => {
    if (message.id != oldM.id) return;

    const newCodes = getCodes(newM);

    if (collection.includes(newCodes[0])) return;

    collection.push(...newCodes);

    while (pos < collection.length) {
      collection.splice(pos, 0, `\n \n`);
      pos += 50 + 1;
    }

    cm.edit(collection.join(" "));
  });
};
