const express = require("express");

const authMiddleware = require("../../middlewares/authMiddleware.js");
const controller = require("./notiController.js");

const router = express.Router();

router.get("/", authMiddleware, controller.get);

router.put("/seen", authMiddleware, controller.seen);

module.exports = router;
