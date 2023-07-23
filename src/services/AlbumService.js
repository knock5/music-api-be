const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addNewAlbum({ name, year }) {
    const id = nanoid(16);
    const statement = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(statement);

    if (!result.rows.length) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumsAll() {
    const statement = 'SELECT * FROM albums';
    const result = await this._pool.query(statement);

    if (!result.rows.length) {
      throw new NotFoundError('Album masih kosong');
    }

    return result;
  }

  async getAlbum(id) {
    const statement = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(statement);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const album = result.rows[0];
    const songStatement = {
      text: 'SELECT id, title, performer FROM songs WHERE id = $1',
      values: [id],
    };
    const songs = this._pool.query(songStatement);

    if (!songs.rows.length > 0) {
      album.songs = songs.rows;
    }

    return album;
  }

  async updateAlbum(id, { name, year }) {
    const statement = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(statement);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal diperbarui');
    }
  }

  async deleteAlbum(id) {
    const statement = {
      text: 'DELETE FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(statement);

    if (!result.rows.length) {
      throw new NotFoundError('Tidak ada album yang dihapus');
    }
  }
}

module.exports = AlbumService;
