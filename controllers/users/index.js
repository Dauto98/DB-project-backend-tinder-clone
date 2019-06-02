const express = require("express");

const authMiddleware = require("../../middlewares/authMiddleware.js");
const controller = require("./userController.js");

const router = express.Router();

router.get("/filter", authMiddleware, controller.filter);

router.get("/liked", authMiddleware, controller.getLiked);

router.get("/unliked", authMiddleware, controller.getUnliked);

router.get("/:id", authMiddleware, controller.getOne);

router.put("/:id", authMiddleware, controller.like);

router.put("/update/:id", authMiddleware, controller.update);

router.put("/changepass/:id", authMiddleware , controller.change);

module.exports = router;
