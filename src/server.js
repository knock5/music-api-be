require('dotenv').config();
const Hapi = require('@hapi/hapi');
const TokenManager = require('./tokenize/TokenManager');

// plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const authentications = require('./api/authentication');

// services
const AlbumsService = require('./services/AlbumServices');
const SongsService = require('./services/SongService');
const UserService = require('./services/UserServices');
const AuthenticationService = require('./services/AuthenticationService');

// validator
const AlbumValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const UserValidator = require('./validator/users');
const AuthenticationValidator = require('./validator/authentications');

const init = async () => {
  const songsService = new SongsService();
  const albumsService = new AlbumsService();
  const userService = new UserService();
  const authenticationsService = new AuthenticationService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
