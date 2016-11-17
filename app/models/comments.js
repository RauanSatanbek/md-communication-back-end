var mongoose = require("../libs/mongoose.js");
var Schema = mongoose.Schema;

var schema = new Schema({
	userName: String,
	userId: String,
	postId: String,
	text: String,
	date: Number
});

exports.Comments = mongoose.model("comments", schema);
// console.log("Mongoose");