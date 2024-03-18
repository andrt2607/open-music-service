/* eslint-disable linebreak-style */
const {
  PostPlaylistPayloadSchema,
  PostPlaylistWithSongPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePlaylistWithSongPayload: (payload) => {
    const validationResult = PostPlaylistWithSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
