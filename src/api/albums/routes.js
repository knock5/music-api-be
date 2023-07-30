const routes = (handler) => [
  {
    method: 'POST',
    path: '/album',
    handler: (request, h) => handler.postAlbumHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums',
    handler: (request, h) => handler.getAlbumsHandler(request, h),
  },
  {
    method: 'GET',
    path: '/album/{id}',
    handler: (request, h) => handler.getAlbumIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/album/{id}',
    handler: (request, h) => handler.editAlbumByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/album/{id}',
    handler: (request, h) => handler.deleteAlbumByIdHandler(request, h),
  },
];

module.exports = routes;
