const express = require("express");
const cors = require("cors");

const server = express();
const http = require("http").Server(server);
const io = require("socket.io")(http);

const db = require("./models");

require("dotenv").config();

server.use(cors());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

module.exports = require("./socket.js")(io);

require("./routes.js")(server);

db.sequelize.sync().then(() => {
  console.log("Connection has been established successfully.");
}).catch(err => {
  console.error("Unable to connect to the database:", err);
});

const listen = http.listen(3000, () => {
  console.log("server is running on port", listen.address().port);
});
