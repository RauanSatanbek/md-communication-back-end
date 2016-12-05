var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	creator: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
	postId: String,
	text: String,
	date: {type:Date, default: Date.now}
});
module.exports = mongoose.model("Comment", commentSchema);
