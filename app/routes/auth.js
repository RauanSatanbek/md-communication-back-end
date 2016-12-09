var express = require('express');
var router = express.Router();
var async = require('async');

var app = express();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var User = require('../models/User');

passport.use(new LocalStrategy({ usernameField: 'idToEnter' }, function( email, password, done) {
    console.log(email, password, done);
    User.findOne({ idToEnter: email },'name password idToEnter', function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
        console.log("user", user);
        user.comparePassword(password, function(err, isMatch) {
        	console.log("isMatch", isMatch);
            if (err) return done(err);
            if (isMatch) return done(null, user);
            return done(null, false);
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());


// Authentication
app.post('/api/signup', function(req, res, next) {
    async.waterfall([
        function( done) {
            var user = new User({
                // regular
                name: req.body.name,
                password: req.body.password,
                idToEnter: req.body.idToEnter,
                telephone: req.body.telephone,
                email: req.body.email,
                role: 1

        });
            user.save(function(err) {
                if (err) return next(err);
                req.login(user, function(err) {
                    if (err) return next(err);
                    return res.json(user);
                });
                done(err, 'done');

            });
        }
    ])



});
 // passport.authenticate('local'),
app.post('/api/login', passport.authenticate('local'), function(req, res) {

    console.log(req.body);
    res.cookie('user', JSON.stringify(req.user));
    res.send(req.user);
});

app.get('/api/logout', function(req, res, next) {
    req.logout();
    res.send(200);
});
app.get('/api/logout456', function(req, res, next) {
    res.send("Hello auth");
});
app.post('/api/changePassword', function (req, res, next) {
    // userId, password: this.password, newPassword: this.newPassword
    User.findById( req.body.userId , function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) return done(err);
            if (isMatch) {
                user.password = req.body.newPassword;
                user.save(function (err) {
                    res.status(200).send({user: user, message: 'Password update'});
                });
            }else{
                res.status(400).send({user: user, message: 'Password !isMatch'});
            }
        });
    });

});


module.exports = app;