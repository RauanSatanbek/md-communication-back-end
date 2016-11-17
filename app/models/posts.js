var mongoose = require("../libs/mongoose.js");
var Schema = mongoose.Schema;
var schema = new Schema({
	tema: String,
	text: String,
	date: Number,
	answer: Number,
	creator: String,
	creatorName: String
});
exports.Posts = mongoose.model("Posts", schema);