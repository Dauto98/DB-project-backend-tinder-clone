const winston = require("winston");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");

const db = require("../../models");

const generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.colorize()
  )
});

module.exports = {
  login: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`Validation error: ${JSON.stringify(errors.array())}`);
      res.status(422).json({ errors: errors.array() });
    } else {
      db.User.findOne({
        where: { email: req.body.email }
      }).then(user => {
        if (user == null) {
          res.status(422).json({
            message: "Auth failed"
          });
          logger.error("User does not exist!");
        } else {
          bcrypt.compare(req.body.password, user.password).then(result => {
            if (!result) {
              res.status(422).json({
                message: "Auth failed!"
              });
              logger.info("Wrong password");
            } else {
              jwt.sign({
                username: user.username,
                userId: user.id
              }, process.env.SECRET_KEY, { algorithm: "HS512" }, (err, token) => {
                if (err) {
                  res.status(422).json({
                    message: "Auth failed",
                  });
                  logger.error("Cannot create token");
                } else {
                  res.status(200).json({
                    message: "Logged in successfully",
                    token,
                    user
                  });
                }
              });
            }
          }).catch(err => {
            logger.error(err);
            res.status(422).json({
              message: "Auth failed!"
            });
          });
        }
      });
    }
  },

  register: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`Validation error: ${JSON.stringify(errors.array())}`);
      res.status(422).json({ errors: errors.array() });
    } else {
      const newUser = db.User.build({
        email: req.body.email,
        username: req.body.username,
        password: generateHash(req.body.password)
      });

      db.User.findOne({
        where: { username: req.body.username }
      }).then(user => {
        if (user == null) {
          newUser.save();
          res.status(200).json({
            message: "Registered successfully"
          });
        } else {
          logger.info("User already exists!");
          res.status(422).json({
            message: "User already exists"
          });
        }
      });
    }
  }
};
