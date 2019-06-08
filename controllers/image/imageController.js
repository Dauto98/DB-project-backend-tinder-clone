const cloudinary = require("cloudinary").v2;
const uuid = require("uuid/v4");
const db = require("../../models");

module.exports = {
  getImageOfUser: (req, res) => {
    db.Image.findAll({ where: { userId: req.params.id } }).then(imageData => {
      if (imageData.length) {
        const imageUrls = imageData.map(image => ({ id: image.id, url: cloudinary.url(image.id) }));
        res.json(imageUrls);
      } else {
        res.json([]);
      }
    });
  },

  insert: (req, res) => {
    if (req.file) {
      const imageId = uuid();
      db.Image.create({
        id: imageId,
        userId: req.userData.userId
      }).then(() => {
        cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${Buffer.from(req.file.buffer).toString("base64")}`, { public_id: imageId }, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Something is wrong with image storage" });
          } else {
            res.status(200).end();
          }
        });
      });
      res.end();
    } else {
      res.status(400).json({ message: "No image uploaded" });
    }
  },

  delete: (req, res) => {
    db.Image.findOne({ where: {
      id: req.params.imageId,
      userId: req.userData.userId
    } }).then(image => {
      if (image) {
        cloudinary.uploader.destroy(image.id, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Something is wrong with image storage" });
          } else {
            image.destroy().then(() => {
              res.status(200).end();
            });
          }
        });
      } else {
        res.status(400).json({ message: "No such image for this user" });
      }
    });
  }
};
