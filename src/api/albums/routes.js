const routes = (handler) => [
  {
    method: 'POST',
    path: '/album',
    handler: handler.postAlbumHandler,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: handler.getAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/album/{id}',
    handler: handler.getAlbumIdHandler,
  },
  {
    method: 'PUT',
    path: '/album/{id}',
    handler: handler.updateAlbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/album/{id}',
    handler: handler.deleteAlbumByIdHandler,
  },
];

module.exports = routes;
