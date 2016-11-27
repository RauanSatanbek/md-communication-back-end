var mongoose = require("../libs/mongoose.js");
var Schema = mongoose.Schema;
var schema = new Schema({
	name: String,
	avatar: String
});
exports.Users = mongoose.model("Users", schema);