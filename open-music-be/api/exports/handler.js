const autoBind = require("auto-bind");
const playlist = require("../playlist");

class ExportsHandler {
  constructor(playlistService, service, validator) {
    this._playlistService = playlistService;
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);
    const playlistId = request.params.playlistId;
    const message = {
      userId: request.auth.credentials.id,
      playlistId: playlistId,
      targetEmail: request.payload.targetEmail,
    };
    await this._playlistService.verifyPlaylistOwner({ playlistId, ownerId: request.auth.credentials.id });
    await this._service.sendMessage(
      'export:playlist',
      JSON.stringify(message)
    );
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
