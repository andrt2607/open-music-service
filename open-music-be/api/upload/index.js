const UploadsHandler = require('./handler');
const uploadRoutes = require('./routes');
 
module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { albumService, service, validator }) => {
    const uploadsHandler = new UploadsHandler(albumService, service, validator);
    server.route(uploadRoutes(uploadsHandler));
  },
};