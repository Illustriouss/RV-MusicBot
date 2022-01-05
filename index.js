const Discord = require("discord.js");
const Bot = require('./bot.js');

const { prefix, token } = require("./config.json");
const text = require("./text.json");
const client = new Discord.Client();
const bot = new Bot(prefix, text);

client.once("ready", () => {
  console.log(text.ready);
});

client.once("reconnecting", () => {
  console.log(text.reconnect);
});

client.once("disconnect", () => {
  console.log(text.disconnect);
});

client.on("message", async message => {
  bot.handleMessage(message);
});

client.login(token);