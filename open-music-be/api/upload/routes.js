/* eslint-disable linebreak-style */
const path = require('path');

const uploadRoutes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postUploadAlbumCoverHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/images/{params*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file/images'),
      },
    },
  },
];
module.exports = uploadRoutes;
