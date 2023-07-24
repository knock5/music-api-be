const ClientError = require('../../exceptions/ClientError');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumIdHandler = this.getAlbumIdHandler.bind(this);
    this.updateAlbumByIdHandler = this.updateAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      const { name, year } = request.payload;
      const albumId = await this._service.addNewAlbum({ name, year });
      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan!',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.error(error.statusCode);
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumsHandler(request, h) {
    try {
      const albums = await this._service.getAlbumsAll();
      const response = h.response({
        status: 'success',
        data: {
          albums,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      // Server ERROR!
      const response = h.response({
        staus: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbum(id);
      const response = h.response({
        status: 'success',
        data: {
          album,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      console.error(error.statusCode);
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async updateAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.updateAlbum(id, request.payload);
      const response = h.response({
        status: 'success',
        message: 'Album berhasil diperbarui',
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
        console.error(error.message);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteAlbum(id);
      const response = h.response({
        status: 'success',
        message: 'Album berhasil dihapus',
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
      // Server ERROR!
      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kesalahan pada server kami...',
      });
      response.code(500);
      response.error(error);
      return response;
    }
  }
}

module.exports = AlbumHandler;
