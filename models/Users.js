// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var crypto = require('crypto');
var express = require('express');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');

var config = require('../config/config');


var userdata = express();
userdata.set('superSecret', config.secret);


// set up a mongoose model and pass it using module.exports
var UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true },
    hash: String,
    salt: String,
    admin : Boolean
});

UserSchema.methods.setPassword = function (password) {
    console.log('Enter set Password');
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function (password) {
    console.log('Validate Password');
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};


UserSchema.methods.generateJWT = function () {
    console.log('generate jwt token');
    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, userdata.get('superSecret'));
};


module.exports = mongoose.model('User', UserSchema);