const db = require("../../models");

module.exports = {
  getAll: (req, res) => {
    db.Feedback.findAll({ where: { userId: req.userData.userId } }).then(data => {
      res.json(data);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
  },

  insert: (req, res) => {
    db.Feedback.create({
      userId: req.userData.userId,
      header: req.body.header,
      content: req.body.content
    }).then(() => db.Feedback.findAll({ where: { userId: req.userData.userId } })).then(data => {
      res.json(data);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
  }
};
