/* eslint-disable camelcase */
const mapAlbumEntityToModel = ({
  id,
  name,
  year,
  created_at,
  updated_at,
  cover_url,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
  coverUrl: cover_url,
});

const mapSongEntityToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapAlbumEntityToModel, mapSongEntityToModel };
