var mongoose = require("../libs/mongoose.js");
var Schema = mongoose.Schema;
var schema = new Schema({
	theme: String,
	text: String,
	date: {type: Date, default: Date.now},
	answer: {type: Date, default: Date.now},
	creator : [{type: Schema.Types.ObjectId, ref: 'Users'}],
	users: [{type: Schema.Types.ObjectId, ref: 'Users'}],
	favorite: [String]
});
exports.Posts = mongoose.model("Posts", schema);