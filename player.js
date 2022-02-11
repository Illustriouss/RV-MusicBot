const ytdl = require("ytdl-core-discord");
const ytpl = require('ytpl');

module.exports = class Player {

  constructor(message) {
    this.ytdl = ytdl;
    this.voiceChannel = message.member.voice.channel;
    this.textChannel = message.channel;
    this.songs = [];
    this.volume = 5;
    this.playing = false;
    this.connection = null;
    this.dispatcher = null;
    this.leaveTimer = null;
  }

  async add(url) {
    if (url.includes('&list')) {
      const playlist = await ytpl(url);
      for (let item of playlist.items) {
        await this.addSong(item.shortUrl);
      }
    } else {
      await this.addSong(url);
    }
  }

  async addSong(url) {
    const songInfo = await this.ytdl.getInfo(url);
    this.songs.push({
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      length: songInfo.videoDetails.lengthSeconds
    });
  }

  async start() {
    if (this.playing) {
      this.textChannel.send(`**${this.songs[this.songs.length-1].title}** has been added to the queue!`);
      return;
    }
    this.connection = await this.voiceChannel.join();
    this.playing = true;
    this.textChannel.send(`Start playing: **${this.songs[0].title}**`);
    this.play();
  }

  async play() {
    if (!this.songs[0]) {
      // this.voiceChannel.leave();
      this.playing = false;
      return;
    }

    this.dispatcher = this.connection
    .play(await ytdl(this.songs[0].url), {type: 'opus'})
    .on("finish", () => {
      this.songs.shift();
      this.play();
    })
    .on("error", error => console.error(error));
    this.dispatcher.setVolumeLogarithmic(this.volume / 5);
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
    this.textChannel.send(`Skipping to **${this.songs[0].title}**`);
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

  nowPlaying() {
    const song = this.songs[0];
    if (this.playing && song) {
      const currentTime = Math.round(this.dispatcher.count/60/60);
      const songLength = Math.round(song.length/60);
      this.textChannel.send(
        `now playing **${song.title}** (~${currentTime}/${songLength} minutes)`
      );
    }
  }
}