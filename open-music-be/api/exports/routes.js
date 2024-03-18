/* eslint-disable linebreak-style */


const exportRoutes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
];

module.exports = exportRoutes;
