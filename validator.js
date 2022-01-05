

module.exports = class Validator {

  constructor() {

  }

  getURL(msg) {
    return msg.content.split(" ")[1];
  }

  hasPermission(msg, prefix) {
    const voiceChannel = msg.member.voice.channel;
    const permissions = voiceChannel.permissionsFor(msg.client.user);

    if (msg.author.bot) {
      console.log("Message by bot, ignore");
      return false;
    }

    if (!msg.content.startsWith(prefix)) {
      console.log("No valid prefix found", prefix);
      return false;
    }

    if (!voiceChannel) {
      console.log("You are not connected to a voice channel");
      return false;
    }

    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      console.log("You don't have the right permissions for this voice channel");
      return false;
    }

    return true;
  }
}