require('dotenv').config();
const Hapi = require('@hapi/hapi');
<<<<<<< HEAD
// Plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
// Services
const AlbumsService = require('./services/AlbumServices');
const SongsService = require('./services/SongService');
// Validator
const AlbumValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
// Error handling
const ClientError = require('./exceptions/ClientError');
=======

// plugins
const albums = require('./api/albums');
const songs = require('./api/songs');

// services
const AlbumService = require('./services/AlbumService');
const SongService = require('./services/SongService');
>>>>>>> parent of 92009f7 (add: create validator and fixing code)

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: songs,
    service: songService,
  });

  await server.register({
    plugin: albums,
    service: albumService,
  });

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // Penanganan client error internal
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami...',
      });
      newResponse.code(500);
      return newResponse;
    }
    // Jika bukan error lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
