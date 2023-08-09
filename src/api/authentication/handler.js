const ClientError = require('../../exceptions/ClientError');

class AuthenticationHandler {
  constructor(authenticationService, usersService, tokenManager, validator) {
    this.authenticationService = authenticationService;
    this.usersService = usersService;
    this.tokenManager = tokenManager;
    this.validator = validator;
  }

  async postAuthenticationHandler(request, h) {
    try {
      const { username, password } = request.payload;
      const id = await this.usersService.verifyUserCredential(username, password);
      const accessToken = this.tokenManager.generateAccessToken({ id });
      const refreshToken = this.tokenManager.generateRefreshToken({ id });
      await this.authenticationService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication telah ditambahkan dengan sukses',
        data: {
          accessToken,
          refreshToken,
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

  async putAuthenticationHandler(request, h) {
    try {
      const { refreshToken } = request.payload;
      await this.authenticationService.verifyRefreshToken(refreshToken);
      const { id } = this.tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = this.tokenManager.generateAccessToken({ id });
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
      const { refreshToken } = request.payload;
      await this.authenticationService.verifyRefreshToken(refreshToken);
      await this.authenticationService.delRefreshToken(refreshToken);
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
