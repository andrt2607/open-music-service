/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const { v4 } = require('uuid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistOwner({ playlistId, ownerId }) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak valid');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addPlaylist({ name, ownerId }) {
    const id = v4();
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, name, ownerId, createdAt],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylists(id) {
    const query = {
      text: 'SELECT ps.id, ps.name, u.username FROM playlists ps JOIN users u ON ps.owner = u.id WHERE u.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT ps.id, ps.name, u.username FROM playlists ps JOIN users u ON ps.owner = u.id WHERE ps.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('playlist gagal dihapus');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = v4();
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $4)',
      values: [id, playlistId, songId, createdAt],
    };
    await this._pool.query(query);
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: 'SELECT s.id, s.title, s.performer FROM songs s JOIN playlist_songs ps ON s.id = ps.song_id WHERE ps.playlist_id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('lagu gagal dihapus dari playlist');
    }
  }
}

module.exports = PlaylistService;
