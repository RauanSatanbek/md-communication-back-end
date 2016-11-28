var mongoose = require("../libs/mongoose.js");
var Schema = mongoose.Schema;
var postSchema = new Schema({
	theme: String,
	text: String,
	date: {type: Date, default: Date.now},
	answer: {type: Date, default: Date.now},
	creator : [{type: Schema.Types.ObjectId, ref: 'Users'}],
	users: [{type: Schema.Types.ObjectId, ref: 'Users'}],
	favorite: [String]
});
module.exports = mongoose.model("Post", postSchema);