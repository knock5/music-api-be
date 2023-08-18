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

module.exports = {
  mapDBToModelSong, mapDBToModelSongDetail,
};
