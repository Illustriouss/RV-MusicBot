const ytdl = require("ytdl-core-discord");
const ytpl = require('ytpl');

module.exports = class Player {
  constructor() {
    this.ytdl = ytdl;
    this.voiceChannel = null;
    this.textChannel = null;
    this.connection = null;
    this.songs = [];
    this.volume = 5;
    this.playing = false;
  }

  async add(url) {
    if (url.includes('&list')) {
      const playlist = await ytpl(url);
      for (let item of playlist.items) {
        await this.addSong(item.shortUrl);
      }
    } else {
      return await this.addSong(url);
    }
  }

  async addSong(url) {
    const songInfo = await this.ytdl.getInfo(url);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };
    this.songs.push(song);
    return await song.title;
  }

  async start() {
    if (this.playing) {
      message.channel.send(`**${title}** has been added to the queue!`);
      return;
    }
    this.connection = await this.voiceChannel.join();
    this.playing = true;
    this.textChannel.send(`Start playing: **${this.songs[0].title}**`);
    this.play();
  }

  async play() {
    if (!this.songs[0]) {
      this.voiceChannel.leave();
      this.playing = false;
      return;
    }

    const dispatcher = this.connection
    .play(await ytdl(this.songs[0].url), {type: 'opus'})
    .on("finish", () => {
      this.songs.shift();
      this.play();
    })
    .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(this.volume / 5);
  }

  queue() {
    let msgString = `Current queue:\nNow playing: **${this.songs[0].title}**\n`;
    this.songs.slice(1).forEach((song, i) => {
      msgString += `${i+1}: **${song.title}**\n`;
    });
    this.textChannel.send(msgString);
  }

  skip() {
    this.connection.dispatcher.end();
  }

  skipto(index) {
    this.songs.splice(0, index);
    this.skip();
  }

  stop() {
    this.songs = [];
    this.playing = false;
    this.connection.dispatcher.end();
  }

  hasQueue() {
    return this.songs.length > 1;
  }
}