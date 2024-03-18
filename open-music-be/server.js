require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const album = require('./api/album');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumsValidator = require('./validator/album');
const SongService = require('./services/postgres/SongService');
const SongsValidator = require('./validator/song');
const song = require('./api/song');
const UserService = require('./services/postgres/UserService');
const users = require('./api/users');
const UsersValidator = require('./validator/user');
const AuthenticationsValidator = require('./validator/authentication');
const AuthenticationService = require('./services/postgres/AuthenticationService');
const authentications = require('./api/authentication');
const TokenManager = require('./tokenize/TokenManager');
const PlaylistService = require('./services/postgres/PlaylistService');
const playlist = require('./api/playlist');
const PlaylistValidator = require('./validator/playlist');
const ClientError = require('./exceptions/ClientError');
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

const path = require('path');
const UploadsValidator = require('./validator/upload');
const upload = require('./api/upload');
const StorageService = require('./services/storage/StorageService');
const CacheService = require('./services/redis/CacheService');
const AlbumLikesService = require('./services/postgres/AlbumLikesService');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authService = new AuthenticationService();
  const playlistService = new PlaylistService();
  const cacheService = new CacheService();
  const albumLikesService = new AlbumLikesService(cacheService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/upload/file/images'));
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
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('open_music_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register(
    [
      {
        plugin: album,
        options: {
          service: albumService,
          albumLikesService,
          validator: AlbumsValidator,
        },
      },
      {
        plugin: song,
        options: {
          service: songService,
          validator: SongsValidator,
        },
      },
      {
        plugin: users,
        options: {
          service: userService,
          validator: UsersValidator,
        },
      },
      {
        plugin: authentications,
        options: {
          authService,
          usersService: userService,
          tokenManager: TokenManager,
          validator: AuthenticationsValidator,
        },
      },
      {
        plugin: playlist,
        options: {
          songService,
          playlistService,
          validator: PlaylistValidator,
        },
      },
      {
        plugin: _exports,
        options: {
          playlistService,
          service: ProducerService,
          validator: ExportsValidator,
        },
      },
      {
        plugin: upload,
        options: {
          albumService,
          service: storageService,
          validator: UploadsValidator,
        },
      },
    ],
  );

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
