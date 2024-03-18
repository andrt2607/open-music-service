/* eslint-disable max-len */
/* eslint-disable object-shorthand */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(songService, playlistService, validator) {
    this._songService = songService;
    this._playlistService = playlistService;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlistService.addPlaylist({ name, ownerId: credentialId });
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistService.getPlaylists(credentialId);
    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner({ playlistId: id, ownerId: credentialId });
    await this._playlistService.deletePlaylistById(id);
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistWithSongPayload(request.payload);
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner({ playlistId, ownerId: credentialId });
    await this._songService.verifySong(songId);
    await this._playlistService.addSongToPlaylist(playlistId, songId);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongFromPlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner({ playlistId, ownerId: credentialId });
    const playlist = await this._playlistService.getPlaylistById(playlistId);
    const result = await this._playlistService.getSongsFromPlaylist(playlistId);
    playlist.songs = result;
    const response = h.response({
      status: 'success',
      data: {
        playlist: playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongFromPlaylistByIdHandler(request, h) {
    this._validator.validatePlaylistWithSongPayload(request.payload);
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner({ playlistId, ownerId: credentialId });
    await this._songService.verifySong(songId);
    await this._playlistService.deleteSongFromPlaylist(playlistId, songId);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistHandler;
