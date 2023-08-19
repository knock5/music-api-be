const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

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

  async delSongInPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu dalam playlist gagal terhapus');
    }
  }

  async addActivityPlaylist(playlistId, songId, userId, action) {
    const query = {
      text: 'INSERT INTO playlist_song_activities(playlist_id, song_id, user_id, action) VALUES($1, $2, $3, $4) RETURNING id',
      values: [playlistId, songId, userId, action],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan aktivitas pada playlist');
    }
  }

  async getActivitiesPlaylist(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, action, time FROM playlist_song_activities
                            JOIN songs ON songs.id = playlists_song_activities.song_id
                            JOIN users ON users.id = playlist_song_activities.user_id
                            WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Id playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Maaf, Anda tidak memiliki akses untuk ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      // eslint-disable-next-line no-useless-catch
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch (err) {
        throw err;
      }
    }
  }
}

module.exports = PlaylistService;
