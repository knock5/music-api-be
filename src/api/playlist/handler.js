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
  }

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistService.getAllPlaylist(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async postPlaySongHandler(request, h) {
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
  }

  async getSongInPlaylistHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._playlistService.getSongInPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async delSongInPlaylistByIdHandler(request) {
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

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async delPlaylistHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistService.delPlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil terhapus',
    };
  }

  async getActivitiesHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._playlistService.getActivitiesPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistHandler;
