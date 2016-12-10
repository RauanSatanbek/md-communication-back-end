var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// client schema from ticket
var clientSchema = new mongoose.Schema({
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

clientSchema.pre('save', function(next) {
    var client = this;
    if (!client.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(client.password, salt, function(err, hash) {
            if (err) return next(err);
            client.password = hash;
            next();
        });
    });
});

clientSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('Client', clientSchema);