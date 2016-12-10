var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var postSchema = new Schema({
	theme: String,
	text: String,
	date: {type: Date, default: Date.now},
	answer: {type: Date, default: Date.now},
	creator : [{type: Schema.Types.ObjectId, ref: 'User'}],
	users: [{type: Schema.Types.ObjectId, ref: 'User'}],
	favorite: [String]
});
module.exports = mongoose.model("Post", postSchema);