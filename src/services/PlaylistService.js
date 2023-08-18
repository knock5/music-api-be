const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class PlaylistService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAllPlaylist(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username, FROM playlists 
              LEFT JOIN users ON users.id = playlists.owner
              LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
              WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak dapat ditemukan');
    }
    return result.rows;
  }

  async delPlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus playlist, id tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const query = {
      text: 'INSERT INTO playlist_songs(playlist_id, song_id) VALUES($1, $2) RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu tidak berhasil ditambahkan ke playlist');
    }
  }

  async getSongInPlaylist(playlistId) {
    const queryPlaylists = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
                LEFT JOIN users ON users.id = playlists.owner
                WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const querySongs = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
                JOIN playlist_songs ON songs.id = playlist_songs.song_id
                WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const resPlaylists = await this._pool.query(queryPlaylists);
    const resSongs = await this._pool.query(querySongs);

    return {
      ...resPlaylists.rows[0],
      songs: resSongs.rows,
    };
  }
}

module.exports = PlaylistService;
