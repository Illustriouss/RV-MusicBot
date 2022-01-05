const Validator = require('./validator.js');
const Player = require('./player.js');

module.exports = class Bot {

  constructor(prefix, text) {
    this.prefix = prefix;
    this.text = text;
    this.servers = new Map();
    this.validator = new Validator();
  }

  getOrCreateServerPlayer(id) {
    if (!this.servers.get(id)) {
      this.servers.set(id, new Player());
    }
    return this.servers.get(id);
  }

  async start(message) {
    let url = this.validator.getURL(message);
    if (!url) return;
    const guildID = message.guild.id;
    const player = this.getOrCreateServerPlayer(guildID);
    player.voiceChannel = message.member.voice.channel;
    player.textChannel = message.channel;
    const title = await player.add(url);
    player.start();
  }

  async handleMessage(message) {
    const player = this.servers.get(message.guild.id);
    console.log(this.prefix);
    if (!this.validator.hasPermission(message, this.prefix)) return;

    switch (message.content.split(" ")[0].substring(1)) {
      case "play":
        this.start(message);
        break;
      case "skipto":
        player.skipto(parseInt(message.content.split(" ")[1]) - 1);
        break;
      case "skip":
        player.skip();
        break;
      case "stop":
        player.stop();
        break;
      case "queue":
        player.queue();
        break;
      default:
        message.channel.send(this.text.invalidCommand);
    }
  }
}