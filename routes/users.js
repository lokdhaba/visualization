var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var router = express.Router();
var config = require('../config/config');


var jwt = require('jsonwebtoken');
var data = express();

data.set('superSecret', config.secret); // secret variable

var User = require('../models/Users'); // get our mongoose model
var passportconfig = require('../config/passport');

//in future to login to the page with and appropriate username and password after registrarion
//route that will authenticate a user logged in
router.post('/login', function (req, res, next) {
    console.log('Entered into login');
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }
    passport.authenticate('local', function (err, user, info) {
        console.log('Entered into passport authentication');
        if (err) { return next(err); }

        if (user) {
            return res.json({
                //pass this token as param to all future api requests to meake it secure
                token: user.generateJWT()              
            });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

//Api call -http://localhost:8090/users/register
router.get('/register', function (req, res, next) {
    console.log('Enter in register routers');

    var user = new User();

    //this will be passed thru form based authentication from front end and will be 
    //stored as hash keyword at backend in mongo ( so that password is not visible)
    //change the get method to post for new registration and pass the req params
    //user.username = req.body.username;
    //user.setPassword(req.body.password)

    //hardcoding for now
    var nick = {
        name: 'dbadmin',
        password: 'password',
        admin: true
    };
    user.username = nick.name;
    user.password = nick.password;
    user.admin = nick.admin;

    user.setPassword(user.password)

    user.save(function (err) {
        if (err) { return next(err); }

        return res.json({ token: user.generateJWT() })
    });
});

// route middleware to verify a token
router.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, data.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

/* GET users listing. */
router.get('/getusers', function(req, res, next) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

module.exports = router;
