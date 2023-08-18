const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class PlaylistHandler {
  constructor(playlistService, songService, validator) {
    this._playlistService = playlistService;
    this._songService = songService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);

      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const playlistId = await this._playlistService.addPlaylist({ name, owner: credentialId });
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._playlistService.getAllPlaylist(credentialId);
      const response = h.response({
        status: 'success',
        data: {
          playlists,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: 'Playlist gagal didapatkan, kesalahan kredensial',
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      return response;
    }
  }

  async postPlaySongHandler(request, h) {
    try {
      this._validator.validatePlaySongPayload(request.payload);

      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._songService.getSong(songId);
      await this._playlistService.addSongToPlaylist(playlistId, songId);
      // Playlist activity
      const action = 'add';
      await this._playlistService.addActivityPlaylist(
        playlistId,
        songId,
        credentialId,
        action,
      );
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getSongInPlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this._playlistService.getSongInPlaylist(playlistId);
      const response = h.response({
        status: 'success',
        data: {
          playlist,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async delSongInPlaylistByIdHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistService.delSongInPlaylist(playlistId, songId);
      // Playlist activity
      const action = 'delete';
      await this._playlistService.addActivityPlaylist(
        playlistId,
        songId,
        credentialId,
        action,
      );
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      return response;
    }
  }

  async delPlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
      await this._playlistService.delPlaylistById(playlistId);
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil terhapus',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: 'Playlist gagal dihapus, id tidak ditemukan',
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getActivitiesHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      const activities = await this._playlistService.getActivitiesPlaylist(playlistId);
      const response = h.response({
        status: 'success',
        data: {
          playlistId,
          activities,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: 'Playlist gagal dihapus, id tidak ditemukan',
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistHandler;
