var express = require('express');
var bodyParser = require('body-parser');
var http = require('http').Server(server);
var io = require('socket.io')(http);
var cors = require('cors');
let passport = require('passport');
let session = require('express-session');
let bcrypt = require('bcrypt');
const db = require('./models');

require('./passport_setup')(passport);
var server = express();

server.use(session({ secret: 'our new secret' }));
server.use(passport.initialize());
server.use(passport.session());
server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

db.sequelize.sync().then(() => {
    const generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
    }

    server.post("/api/register", function (req, res, next) {
        console.log("-----------------------------------");
        console.log("Register request:");
        console.log("username:", req.body.username);
        console.log("password:", req.body.password);
        console.log("-----------------------------------");

        const newUser = db.User.build({
            username: req.body.username,
            password: generateHash(req.body.password)
        });
        return newUser.save().then(result => {
            passport.authenticate('local', {
                //TODO: put redirect here
                failureFlash: true,
            })(req, res, next);
        })
    });

    server.post("/api/login", function (req, res) {
        console.log("-----------------------------------");
        console.log("Login request:");
        console.log("username:", req.body.username);
        console.log("password:", req.body.password);
        console.log("-----------------------------------");

        passport.authenticate('local', {
            //TODO: put redirect here
            failureFlash: true,
        })(req, res, next);
    });

    server.get("/api/logout", function (req, res) {
        console.log("Logged out");

        req.logout();
        req.session.destroy();
        res.redirect('/');
    });

    var listen = server.listen(3000, () => {
        console.log("server is running on port", listen.address().port);
    });
});
