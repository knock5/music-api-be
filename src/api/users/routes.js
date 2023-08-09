const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUserHandler(request, h),
  },
  {
    method: 'GET',
    path: '/users',
    handler: () => handler.getUsersHandler(),
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: (request, h) => handler.getUserByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    handler: (request, h) => handler.putUserByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: (request, h) => handler.deleteUserByIdHandler(request, h),
  },
];

module.exports = routes;
