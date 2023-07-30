const routes = (handler) => [
  {
    method: 'POST',
<<<<<<< HEAD
    path: '/songs',
    handler: (request, h) => handler.postSongHandler(request, h),
=======
    path: '/song',
    handler: handler.postSongHandler,
>>>>>>> parent of 92009f7 (add: create validator and fixing code)
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request, h) => handler.getSongsHandler(request, h),
  },
  {
    method: 'GET',
<<<<<<< HEAD
    path: '/songs/{id}',
    handler: (request, h) => handler.getSongByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request, h) => handler.editSongByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request, h) => handler.deleteSongByIdHandler(request, h),
=======
    path: '/song/{id}',
    handler: handler.getSongByIdHandler,
  },
  {
    method: 'PUT',
    path: '/song/{id}',
    handler: handler.updateSongByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/song/{id}',
    handler: handler.deleteSongByIdHandler,
>>>>>>> parent of 92009f7 (add: create validator and fixing code)
  },
];

module.exports = routes;
