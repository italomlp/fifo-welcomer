require("dotenv/config");
const { Client, Intents } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.on("ready", () => {
  console.log("I am ready!");
});

const prefix = process.env.PREFIX;

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content === `${prefix}oififo`) {
    const user = message.guild.members.cache.get(process.env.FIFO_ID);
    const { channel } = user.voice;

    if (!channel) {
      return message.channel.send("Fifo is not in a voice channel.");
    }

    message.channel.send("Fifo will be greeted!");

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(
      "http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&prev=input&textlen=7&q=oi%20fifo&tl=pt-br&ttsspeed=1"
    );

    const subscription = connection.subscribe(player);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
      subscription.unsubscribe();
      connection.disconnect();
    });
  }
});

client.login(process.env.DISCORD_TOKEN);

// Idle - the initial state of an audio player. The audio player will be in this state when there is no audio resource for it to play.

// Buffering - the state an audio player will be in while it is waiting for an audio resource to become playable. The audio player may transition from this state to either the Playing state (success) or the Idle state (failure).

// Playing - the state a voice connection enters when it is actively playing an audio resource. When the audio resource comes to an end, the audio player will transition to the Idle state.

// AutoPaused - the state a voice connection will enter when the player has paused itself because there are no active voice connections to play to. This is only possible with the noSubscriber behavior set to Pause. It will automatically transition back to Playing once at least one connection becomes available again.
