var mongoose = require("../libs/mongoose.js");
var Schema = mongoose.Schema;

var schema = new Schema({
	creator: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
	postId: String,
	text: String,
	date: Number
});
exports.Comments = mongoose.model("Comments", schema);
