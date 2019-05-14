module.exports = (server) => {
  server.use("/api/", require("./controllers/auth/index.js"));
};
