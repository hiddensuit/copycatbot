module.exports = {
  names: ["bio"],
  arguments: ["<bio content>"],
  examples: ["bio yoooooo wazzup"],
  callback: async ({ message, args, db }) => {
    const bioLimit = 250;
    const bio = message.content.substring(6);

    const user = await db.User.findOne({ where: { id: message.author.id } });

    if (bio.length > bioLimit) return message.channel.send(`bio cannot be longer than ${bioLimit}.`);

    await user
      .update({ bio: bio })
      .then(() => {
        return message.channel.send(`your bio has been updated successfully! check it out with cc p`);
      })
      .catch((e) => {
        console.error(e);
        return message.channel.send("failed to update your bio...");
      });
  },
};
