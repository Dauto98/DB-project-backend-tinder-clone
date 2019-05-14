module.exports = (server) => {
  server.use("/api/", require("./controllers/auth/index.js"));

  server.use("*", (req, res) => {
    res.status(404).json({ message: "Whoops, what are you looking for?" });
  });
};
