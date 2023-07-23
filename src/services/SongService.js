const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { mapDBToModelSong, mapDBToModelSongDetail } = require('../utils');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addNewSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [
        id, title, year, performer, genre, duration, albumId, insertedAt, insertedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongsAll() {
    const query = 'SELECT id, title, performer FROM songs';
    const songs = await this._pool.query(query);
    return songs.rows.map(mapDBToModelSong);
  }

  async getSongByIdHandler(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const song = await this._pool.query(query);

    if (!song.rows.length) {
      throw new NotFoundError('Lagu tidak dapat ditemukan');
    }

    return song.rows.map(mapDBToModelSongDetail)[0];
  }

  async updateSongByIdHandler(id, { title, year, performer, genre, duration, albumId }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, albumId = $6, updatedAt = $7 WHERE id RETURNING id',
      values: [title, year, performer, genre, duration, albumId, updatedAt, id]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal diperbarui');
    }
  }

  async deleteSong(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus');
    }
  }
}

module.exports = SongService;
