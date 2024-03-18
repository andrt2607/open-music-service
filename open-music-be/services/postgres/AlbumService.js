/* eslint-disable no-underscore-dangle */
const { v4 } = require('uuid');
const { Pool } = require('pg');
const { mapAlbumEntityToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumService {
  constructor() {
    this._albums = [];
    this._pool = new Pool();
  }

  async editAlbumCover(id, fileLocation) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [fileLocation, id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui cover album. Id tidak ditemukan');
    }
  }

  async addAlbum({ name, year }) {
    const id = v4();
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id,
        name,
        year,
        createdAt],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('album tidak ditemukan');
    }

    return mapAlbumEntityToModel(result.rows[0]);
  }

  async updateAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
