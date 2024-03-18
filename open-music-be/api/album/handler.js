/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(service, albumLikesService, validator) {
    this._service = service;
    this._validator = validator;
    this._albumLikesService = albumLikesService;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    // const { id: credentialId } = request.auth.credentials;
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });
    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getSongsByAlbumId(id);
    album.songs = songs;
    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });
    response.code(200);
    return response;
  }

  async putAlbumsByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.updateAlbumById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'album berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async deleteAlbumsByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    const response = h.response({
      status: 'success',
      message: 'album berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.getAlbumById(albumId);
    await this._albumLikesService.getAlbumLike(credentialId, albumId);
    await this._albumLikesService.addAlbumLike(credentialId, albumId);
    const response = h.response({
      status: 'success',
      message: 'Menyukai album berhasil!',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikesCountHandler(request, h) {
    const { id: albumId } = request.params;
    const likes = await this._albumLikesService.getAlbumLikesByAlbumId(albumId);
    const response = h.response({
      status: 'success',
      data: {
        likes: likes.data.length,
      },
    });
    if (likes.source === 'cache') response.header('X-Data-Source', 'cache');
    return response;
  }

  async deleteAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._albumLikesService.deleteAlbumLike(credentialId, albumId);
    const response = h.response({
      status: 'success',
      message: 'Menyukai album berhasil dihapus',
    });
    return response;
  }
}

module.exports = AlbumHandler;
