const PlaylistHandler = require('./handler');
const playlistRoutes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (
    server,
    {
      songService, playlistService, validator,
    },
  ) => {
    const playlistHandler = new PlaylistHandler(songService, playlistService, validator);
    server.route(playlistRoutes(playlistHandler));
  },
};
