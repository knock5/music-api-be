const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlist',
    handler: (request, h) => handler.postPlaylistHandler(request, h),
  },
  {
    method: 'GET',
    path: '/playlist',
    handler: () => handler.getPlaylistHandler(),
  },
  {
    method: 'DELETE',
    path: '/playlist/{id}',
    handler: (request, h) => handler.delPlaylistHandler(request, h),
  },
];

module.exports = routes;
