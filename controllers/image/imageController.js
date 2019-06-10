const cloudinary = require("cloudinary").v2;
const uuid = require("uuid/v4");
const db = require("../../models");

module.exports = {
  getImageOfUser: (req, res) => {
    db.Image.findAll({ where: { userId: req.params.id } }).then(imageData => {
      if (imageData.length) {
        const imageUrls = imageData.map((image, index) => ({ id: image.id, url: cloudinary.url(image.id), order: image.order || index })).sort((a, b) => a.order - b.order);
        res.json(imageUrls);
      } else {
        res.json([]);
      }
    });
  },

  insert: (req, res) => {
    if (req.body.image) {
      const imageId = uuid();
      db.Image.create({
        id: imageId,
        userId: req.userData.userId,
        order: req.body.imgOrder
      }).then(() => {
        cloudinary.uploader.upload(req.body.image, { public_id: imageId }, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Something is wrong with image storage" });
          } else {
            res.status(200).end();
          }
        });
      }).catch(err => {
        console.error(err);
        res.status(500).json({ message: "Error while inserting to DB" });
      });
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
