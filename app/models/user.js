var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var schema = new Schema({
	name: String,
	avatar: String
});
exports.Users = mongoose.model("Users", schema);