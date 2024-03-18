/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(albumService, service, validator) {
    this._albumService = albumService;
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._service.writeFile(cover, cover.hapi);
    const location = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    const albumId = request.params.id;
    await this._albumService.getAlbumById(albumId);
    this._albumService.editAlbumCover(albumId, location);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
