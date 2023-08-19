const InvariantError = require('../../exceptions/InvariantError');
const {
  PostPlaylistPayloadSchema,
  PostSongPayloadSchema,
  PostActivityPayloadSchema,
} = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const resValidation = PostPlaylistPayloadSchema.validate(payload);
    if (resValidation.error) {
      throw new InvariantError(resValidation.error.message);
    }
  },

  validatePlaySongPayload: (payload) => {
    const resValidation = PostSongPayloadSchema.validate(payload);
    if (resValidation.error) {
      throw new InvariantError(resValidation.error.message);
    }
  },

  validateActivityPayload: (payload) => {
    const resValidation = PostActivityPayloadSchema.validate(payload);
    if (resValidation.error) {
      throw new InvariantError(resValidation.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
