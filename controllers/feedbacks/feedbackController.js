const db = require("../../models");

module.exports = {
  getAll: (req, res) => {
    db.Feedback.findAll({ where: { userID: req.userData.userID } }).then(data => {
      res.json(data);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
  },

  insert: (req, res) => {
    db.Feedback.create({
      userID: req.userData.userID,
      content: req.body.content
    }).then(() => db.Feedback.findAll({ where: { userID: req.userData.userID } })).then(data => {
      res.json(data);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
  }
};
