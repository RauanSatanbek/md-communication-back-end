var mongoose = require("../libs/mongoose.js");
var Schema = mongoose.Schema;
var schema = new Schema({
	tema: String,
	text: String,
	date: Number,
	answer: Number,
	creator : [{ type: Schema.Types.ObjectId, ref: 'Users' }],
	users: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
	favorite: [String]
});
exports.Posts = mongoose.model("Posts", schema);