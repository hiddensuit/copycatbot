const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("../config.json");
const eventHandler = require("./handlers/eventHandler");
const db = require("../database/models/index");

db.sequelize
  .sync()
  .then(() => console.log("\x1b[32m%s\x1b[0m", `\nsynced to: ${db.sequelize.getDatabaseName()}`));

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

eventHandler(client, db);

client.login(token);
