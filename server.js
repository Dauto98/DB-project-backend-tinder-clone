const express = require("express");
const cors = require("cors");

const db = require("./models");

require("dotenv").config();

const server = express();

server.use(cors());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

require("./routes.js")(server);

db.sequelize.sync().then(() => {
  console.log("Connection has been established successfully.");
}).catch(err => {
  console.error("Unable to connect to the database:", err);
});

const listen = server.listen(3000, () => {
  console.log("server is running on port", listen.address().port);
});
