const db = require("../../models");
const socket = require("../../server.js");

const { Op } = db.Sequelize;
const bcrypt = require("bcrypt");

const generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

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
                // there is a match
                db.Notification.create({
                  header: "There is a match",
                  content: `${targetUser.username} has liked your profile! Let's go and say hi!`,
                  userId: req.userData.userId
                });
                socket.sendMatchedNoti(req.userData.userId, req.params.id, "There is a match", `${targetUser.username} has liked your profile! Let's go and say hi!`);
                db.Notification.create({
                  header: "There is a match",
                  content: `${req.userData.username} has liked your profile! Let's go and say hi!`,
                  userId: req.params.id
                });
                socket.sendMatchedNoti(req.params.id, req.userData.userId, "There is a match", `${req.userData.username} has liked your profile! Let's go and say hi!`);
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
  },

  update: (req,res) =>{
    db.User.findByPk(req.params.id).then(updateUser =>{
      if(updateUser){

           db.User.update(
             {
               username : req.body.username,
               facebookLink: req.body.facebookLink,
               phoneNumber: req.body.phoneNumber,
               city: req.body.city,
               gender : req.body.gender,
               age : req.body.age,
             },
             {where :{id : req.params.id}}
           ).then(newUpdate => {
             if(newUpdate){
                res.status(200).json({
                 // res.write(
                 //   JSON.stringify(newUpdate));
                    message : "Update Successfully"
                });
             }
             else{
               res.status(422).json({
                 message : "Failed"
               });
             }
           });
      }
      else{
        res.status(422).json({
          message: "Update Failed"
        });
      }
     });
  },

  change : (req, res) =>{
    db.User.findByPk(req.params.id).then(change =>{
      if(change){
         bcrypt.compare(req.body.password, change.password).then(result =>{
           if(result){
             db.User.update({
               password : generateHash(req.body.newpassword),
             },
             {where : {id : req.params.id}}
           ).then(newpass =>{
              if(newpass){
                res.status(200).json({
                  message : "Change successfuly"
                });
              }
          else{
             res.status(422).json({
               message : "Can't update!!!"
             });
           }
         });
       }else{
         res.status(422).json({
           message : "Enter wrong password!!!"
         });
       }
         }).catch(err =>{
           res.status(401).json({
             message : "Auth failed"
           });
         });
      
      }else{
        res.status(422).json({
          message : "Not this person"
        });
      }
    });
  }

};
