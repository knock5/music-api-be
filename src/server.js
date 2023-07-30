require('dotenv').config();
const Hapi = require('@hapi/hapi');
// plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
// services
const AlbumsService = require('./services/AlbumServices');
const SongsService = require('./services/SongService');
// validator
const AlbumValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const songsService = new SongsService();
  const albumsService = new AlbumsService();

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
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
