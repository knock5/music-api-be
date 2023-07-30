const ClientError = require('../exceptions/ClientError');

const mapDBToModelSong = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapDBToModelSongDetail = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
  insertedAt: created_at,
  updatedAt: updated_at,
});

const errorHandler = (error, h) => {
  if (error instanceof ClientError) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(error.statusCode);
    return response;
  }
  // Server Error
  const response = h.response({
    status: 'error',
    message: 'Maaf, terjadi kesalahan pada server kami...',
  });
  response.code(500);
  console.error(error);

  return response;
};

module.exports = { mapDBToModelSong, mapDBToModelSongDetail, errorHandler };
