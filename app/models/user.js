// var mongoose = require("mongoose");
// var Schema = mongoose.Schema;
// var schema = new Schema({
// 	name: String,
// 	avatar: String
// });
// exports.Users = mongoose.model("Users", schema);


var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// user schema
var userSchema = new mongoose.Schema({
    // regular
    name: String,
    // email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    idToEnter: String,
    statusCompany: String,
    nameCompany: String,
    representative: String,
    telephone: String,
    email: String
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', userSchema);