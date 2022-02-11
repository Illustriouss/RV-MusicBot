const Validator = require('./validator.js');
const Player = require('./player.js');

module.exports = class Bot {

  constructor(prefix, text) {
    this.prefix = prefix;
    this.text = text;
    this.servers = new Map();
    this.validator = new Validator();
  }

  getOrCreateServerPlayer(message) {
    const id = message.guild.id;
    if (!this.servers.has(id)) this.servers.set(id, new Player(message));
    return this.servers.get(id);
  }

  async start(message, content) {
    if (!this.validator.isValidURL(content)) return;
    const player = this.getOrCreateServerPlayer(message);
    await player.add(content);
    player.start();
  }

  async handleMessage(message) {
    const command = message.content.split(" ")[0].substring(1);
    const content = message.content.split(" ")[1];
    const player = this.servers.get(message.guild.id);

    if (!player && command != "play"){
        message.channel.send(`No music player available, add a song to start`);
        return;
    }

    if (!this.validator.hasPermission(message, this.prefix)) return;
    
    switch (command) {
      case "play":
      case "p":
        this.start(message, content);
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
      case "q":
        player.queue();
        break;
      case "nowplaying":
      case "np":
        player.nowPlaying()
        break;
      default:
        message.channel.send(this.text.invalidCommand);
    }
  }
}