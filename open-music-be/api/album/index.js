const AlbumHandler = require('./handler');
const albumRoutes = require('./routes');

module.exports = {
  name: 'album',
  version: '1.0.0',
  register: async (server, { service, albumLikesService, validator }) => {
    const albumHandler = new AlbumHandler(service, albumLikesService, validator);
    server.route(albumRoutes(albumHandler));
  },
};
