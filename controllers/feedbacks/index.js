const express = require("express");

const authMiddleware = require("../../middlewares/authMiddleware.js");
const controller = require("./feedbackController.js");

const router = express.Router();

router.get("/", authMiddleware, controller.getAll);

router.post("/", authMiddleware, controller.insert);

module.exports = router;
