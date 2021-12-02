require("dotenv/config");
const { Client, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log("I am ready!");
});

const prefix = process.env.PREFIX;
client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.startsWith(`${prefix}ping`)) {
    message.channel.send("pong!");
  } else if (message.content.startsWith(`${prefix}foo`)) {
    message.channel.send("bar!");
  }
});

client.login(process.env.DISCORD_TOKEN);
