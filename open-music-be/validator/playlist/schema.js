/* eslint-disable linebreak-style */
const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostPlaylistWithSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PostPlaylistPayloadSchema,
  PostPlaylistWithSongPayloadSchema,
};
