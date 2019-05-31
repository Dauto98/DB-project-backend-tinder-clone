const db = require("../../models");

const { Op } = db.Sequelize;

module.exports = {
  get: (req, res) => {
    db.Notification.findAll({
      where: { userId: req.userData.userId },
      order: [["createdAt", "ASC"]],
      limit: req.query.limit || 20,
      offset: req.query.offset || 0
    }).then(data => {
      res.json(data);
    });
  },

  seen: (req, res) => {
    db.Notification.update(
      { status: "seen" },
      { where: {
        userId: req.userData.userId,
        id: { [Op.in]: req.body.notiIds }
      } }
    ).then(() => {
      res.status(200).end();
    });
  }
};
