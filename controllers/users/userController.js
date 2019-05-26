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
            }).then(data => res.json(data.map(userData => ({ ...userData.get({ plain: true }), dob: new Date(userData.dob / 1000).getTime().toString() }))));
          } else {
            db.User.findAll({
              where: {
                gender: user.gender === "F" ? "M" : "F",
                city: user.city
              },
              order: [["createdAt", "ASC"]],
              limit: req.query.limit || 20
            }).then(data => res.json(data.map(userData => ({ ...userData.get({ plain: true }), dob: new Date(userData.dob / 1000).getTime().toString() }))));
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
        res.json({
          ...user.get({ plain: true }),
          dob: new Date(user.dob / 1000).getTime().toString()
        });
      } else {
        res.json({ error: "user not found" });
      }
    });
  },

  /**
   * req.body = {
   *    status: like status
   * }
   */
  like: (req, res) => {
    db.User.findByPk(req.params.id).then(targetUser => {
      if (targetUser) {
        db.LikeStatus.findOne({ where: {
          userId: req.userData.userId,
          targetUserId: req.params.id
        } }).then(liked => {
          if (liked) {
            res.json({ message: "You already swiped this person" });
          } else {
            db.LikeStatus.create({
              userId: req.userData.userId,
              targetUserId: req.params.id,
              status: req.body.status
            });
            db.LikeStatus.findOne({ where: {
              userId: req.params.id,
              targetUserId: req.userData.userId
            } }).then(likeData => {
              if (!likeData || likeData.status === "unliked") {
                res.status(200).end();
              } else {
                res.status(200).json({ status: "matched" });
              }
            });
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
