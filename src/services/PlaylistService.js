const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../exceptions/InvariantError');

class PlaylistService {
  constructor(collaboratorService) {
    this._pool = new Pool();
    this._collaboratorService = collaboratorService;
  }

  async addPlaylist({ name, year }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'SELECT INTO playlist VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }
}

module.exports = PlaylistService;
