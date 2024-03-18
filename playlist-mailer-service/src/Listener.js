const autoBind = require("auto-bind");

class Listener {
  constructor(playlistService, mailSender) {
    this._playlistService = playlistService;
    this._mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { userId, playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      const songs = await this._playlistService.getListSongByPlaylistId(
        playlistId
      );
      const playlist = await this._playlistService.getPlaylistName(playlistId);
      console.log(playlist.id, playlist.name);
      let temp = {
        playlist: { id: playlist.id, name: playlist.name, songs: songs },
      };
      console.log(JSON.stringify(temp));
      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(temp)
      );
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
