const express = require("express");
const multer = require("multer")({
  fileFilter: (req, file, cb) => {
    console.log("Upload file filter");
    console.log(file);
    if (file.mimetype && file.mimetype.includes("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

const authMiddleware = require("../../middlewares/authMiddleware.js");
const controller = require("./imageController.js");

const router = express.Router();

router.get("/:id", authMiddleware, controller.getImageOfUser);

router.post("/", authMiddleware, multer.single("image"), controller.insert);

router.delete("/:imageId", authMiddleware, controller.delete);

module.exports = router;
