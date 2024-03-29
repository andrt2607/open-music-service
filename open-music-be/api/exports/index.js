const ExportsHandler = require("./handler");
const exportRoutes = require("./routes");

module.exports = {
    name: 'exports',
    version: '1.0.0',
    register: async (server, { playlistService, service, validator }) => {
      const exportsHandler = new ExportsHandler(playlistService, service, validator);
      server.route(exportRoutes(exportsHandler));
    },
  };