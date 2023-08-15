const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlist',
    handler: (request, h) => handler.postPlaylistHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlist',
    handler: () => handler.getPlaylistHandler(),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlist/{playlistId}',
    handler: (request, h) => handler.getPlaylistByIdHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlist/{id}',
    handler: (request, h) => handler.delPlaylistHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
