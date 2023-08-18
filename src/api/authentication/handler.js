const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class AuthenticationHandler {
  constructor(authenticationService, usersService, tokenManager, validator) {
    this._authenticationService = authenticationService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);
      const { username, password } = request.payload;
      const id = await this._usersService.verifyUserCredential(username, password);
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });
      await this._authenticationService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication telah ditambahkan dengan sukses',
        data: {
          accessToken,
          refreshToken,
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

  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);
      const { refreshToken } = request.payload;
      await this._authenticationService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const response = h.response({
        status: 'success',
        message: 'Akses token berhasil diperbarui',
        data: {
          accessToken,
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
    }
    // Server Error
    const response = h.response({
      status: 'fail',
      message: 'Maaf, terjadi kesalahan pada server kami...',
    });
    response.code(500);
    return response;
  }

  async delAuthenticationHandler(request, h) {
    try {
      this._validator.validateDelAuthenticationPayload(request.payload);
      const { refreshToken } = request.payload;
      await this._authenticationService.verifyRefreshToken(refreshToken);
      await this._authenticationService.delRefreshToken(refreshToken);
      const response = h.response({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
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

module.exports = AuthenticationHandler;
