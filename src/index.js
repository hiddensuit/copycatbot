const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("../config.json");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

eventHandler(client);

client.login(token);

const db = require("../database/models/index");
