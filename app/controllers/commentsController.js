var Comment = require("../models/comment");
var Post = require("../models/post");
/* ------------------------------------------------------------------------------------------
* addComment
* Добавляем новый комментарий для выбранного поста
* Возвращаем все комменты для выбранного поста
*/
	module.exports.addComment = function(req, res, next){
		var text = req.body.text;
		var postId = req.body.postId;
		var userId = req.body.userId;
		var date = Date.now();
		Post.update({_id: postId}, {$set: {answer: date}})
			.exec(function(err, affected) {
				if(err) console.log("error");
			});
		var comment = new Comment({
			creator: userId,
			postId: postId,
			text: text,
			date: Date.now()
		});
		comment.save(function(err, affected) {
			if(err) {
				res.statusCode = 500;
				res.send(err);
			} else {
				Comment.find({postId: postId})
					.populate([{path: 'creator', select: 'name avatar'}])
					.exec(function(err, result) {
						if (err) return "error";
						else res.send(result);
					});
			}
		});
	};
/* ------------------------------------------------------------------------------------------
* getComment
* Возвращаем все комменты для выбранного поста
*/
	module.exports.getComment = function(req, res, next){
		var postId = req.params.postId;
		Comment.find({postId: postId})
			.populate([{path: 'creator', select: 'name avatar'}])
			.exec(function(err, result) {
				if (err) return "error";
				else res.send(result);
			});
	};