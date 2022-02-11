

module.exports = class Validator {

  constructor() {

  }

  isValidURL(msg){
    let url;

    try {
      url = new URL(msg);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  hasPermission(msg, prefix) {
    const voiceChannel = msg.member.voice.channel;
    const permissions = voiceChannel.permissionsFor(msg.client.user);

    if (msg.author.bot) {
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