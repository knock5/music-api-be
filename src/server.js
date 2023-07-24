require('dotenv').config();
const Hapi = require('@hapi/hapi');

// plugins
const albums = require('./api/albums');
const songs = require('./api/songs');

// services
const AlbumService = require('./services/AlbumService');
const SongService = require('./services/SongService');

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

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
