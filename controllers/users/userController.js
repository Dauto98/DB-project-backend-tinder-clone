const db = require("../../models");

const { Op } = db.Sequelize;

module.exports = {
  filter: (req, res) => {
    db.User.findByPk(req.userData.userId).then(user => {
      if (user) {
        db.LikeStatus.findAll({ where: { userId: req.userData.userId } }).then(likeData => {
          if (likeData.length) {
            db.User.findAll({
              where: {
                id: { [Op.notIn]: likeData.map(like => like.targetUserId) },
                gender: user.gender === "F" ? "M" : "F",
                city: user.city
              },
              order: [["createdAt", "ASC"]],
              limit: req.query.limit || 20
            }).then(data => res.json(data));
          } else {
            db.User.findAll({
              where: {
                gender: user.gender === "F" ? "M" : "F",
                city: user.city
              },
              order: [["createdAt", "ASC"]],
              limit: req.query.limit || 20
            }).then(data => res.json(data));
          }
        });
      } else {
        res.status(400).end();
      }
    });
  },

  getOne: (req, res) => {
    db.User.findByPk(req.params.id).then(user => {
      if (user) {
        res.json(user);
      } else {
        res.json({ error: "user not found" });
      }
    });
  },

  /**
   * req.body = {
   *    id: targetUserId,
   *    status: like status
   * }
   */
  like: (req, res) => {
    db.User.findByPk(req.body.id).then(targetUser => {
      if (targetUser) {
        db.LikeStatus.create({
          userId: req.userData.userId,
          targetUserId: req.body.id,
          status: req.body.status
        });
        db.LikeStatus.findOne({ where: {
          userId: req.body.id,
          targetUserId: req.userData.userId
        } }).then(likeData => {
          if (!likeData || likeData.status === "unliked") {
            res.status(200).end();
          } else {
            res.status(200).json({ status: "matched" });
          }
        });
      } else {
        res.status(404).json({ error: "user not found" });
      }
    });
  },

  getLiked: (req, res) => {
    db.LikeStatus.findAll({ where: {
      userId: req.userData.userId,
      status: "liked"
    },
    attributes: ["targetUserId"] }).then(data => {
      if (data.length) {
        db.User.findAll({ where: { id: { [Op.in]: data.map(like => like.targetUserId) } } }).then(userData => {
          res.json(userData);
        });
      } else {
        res.json([]);
      }
    });
  },

  getUnliked: (req, res) => {
    db.LikeStatus.findAll({ where: {
      userId: req.userData.userId,
      status: "unliked"
    },
    attributes: ["targetUserId"] }).then(data => {
      if (data.length) {
        db.User.findAll({ where: { id: { [Op.in]: data.map(like => like.targetUserId) } } }).then(userData => {
          res.json(userData);
        });
      } else {
        res.json([]);
      }
    });
  }
};
