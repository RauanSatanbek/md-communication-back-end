var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var fs = require("fs");
var app = express();
app.use(cors());
app.use(bodyParser());

/* ------------------------------------------------------------------------------------------
* Подключаем все коллекций
*/
	var Comments = require("./app/models/comments.js").Comments;
	var Posts = require("./app/models/posts.js").Posts;
	var Users = require("./app/models/user.js").Users;
/* ------------------------------------------------------------------------------------------
* get all users
* гетим всех юзеров для - Получатели  
*/
	app.get("/api/user/select:id", function(req, res, next) {
		var query = Users.find({});
		query.$where('this._id != "'+req.params.id+'"')
			.exec(function(err, result) {
				if(err) console.log(err);
				else {
					console.log(result);
					res.send(result);
				}
			});
	});
/* ------------------------------------------------------------------------------------------
* get user
* гетим инфомацию о нашем юзере  
*/
	app.get("/api/user/:id", function(req, res) {
		Users.findOne({_id: req.params.id})
			.exec(function(err, result) {
				if(err) {
					res.statusCode = 500;
					res.send(err);
				} else {
		            console.log(result);
					res.send(result);
				}
			});
	});
/* ------------------------------------------------------------------------------------------
* addComment
* Добавляем новый комментарий для выбранного поста
* Возвращаем все комменты для выбранного поста
*/
	app.post("/api/comment", function(req, res) {
		var text = req.body.text;
		var postId = req.body.postId;
		var userId = req.body.userId;
		var date = Date.now();
		Posts.update({_id: postId}, {$set: {answer: date}})
			.exec(function(err, affected) {
				if(err) console.log("error");
			});
		var comment = new Comments({
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
				Comments.find({postId: postId})
					.populate([{path: 'creator', select: 'name avatar'}])
					.exec(function(err, result) {
						if (err) return "error";
						else res.send(result);
					});
			}
		});
	});
/* ------------------------------------------------------------------------------------------
* get comment
* Возвращаем все комменты для выбранного поста
*/
	app.post("/api/comment/:postId", function(req, res) {
		var postId = req.params.postId;
		Comments.find({postId: postId})
			.populate([{path: 'creator', select: 'name avatar'}])
			.exec(function(err, result) {
				if (err) return "error";
				else res.send(result);
			});
	});
/* ------------------------------------------------------------------------------------------
* get Post
* Возвращаем выбранный пост
*/
	app.post("/api/post/:id", function(req, res) {
		Posts.findOne({_id: req.params.id}, function(err, result) {
			if(err) {
				res.statusCode = 500;
				res.send("Error");
			} else {
				res.send(result);
			}
		});
	});
/* ------------------------------------------------------------------------------------------
* get Posts - Фильтрация
* вызываем фунцию getPosts
* getPosts - Возвращает все посты для выбранный - Мои = 1 || Общие = 2 || Все = 3- 
*/
	app.get("/api/posts/:m", function(req, res) {
		var m = req.params.m.split(":");
		var userId = m[0];
		var filter = parseInt(m[1]);
		// get all post with filter 
			getPosts(res, filter, userId);
	});
		
/* ------------------------------------------------------------------------------------------
* get all post - Фильтрация (функций)
* Возвращаем все посты для выбранный - Мои || Общие || Все -
*/ 
// Мои
	function filterMy(res, userId) {
		Posts.find({creator: userId})
			.populate([{path: 'creator', select: 'name'}])
			.exec(function(err, result) {
				if(err) {
					res.statusCode = 500;
					res.send(err);
				}
				else res.send(result);
			});
	}
// Общие
	function filterCommon(res, userId) {
		Posts.find({users: userId})
			.populate([{path: 'creator', select: 'name'}])
			.exec(function(err, result) {
				if(err) {
					res.statusCode = 500;
					res.send(err);
				}
				else res.send(result);
			});
	}
// Все
	function filterAll(res, userId) {
		Posts.find({$or: [{creator: userId}, {users: userId}]})
			.populate([{path: 'creator', select: 'name'}])
			.exec(function(err, result) {
				if(err) {
					res.statusCode = 500;
					res.send(err);
				}
				else res.send(result);
			});
		}
// Избранные
	function filterFavorite(res, userId) {
		Posts.find({favorite: userId})
			.populate({path: "creator", select: "name"})
			.exec(function(err, result) {
				if(err) {
					res.statusCode = 500;
					res.send(err);
				}
				else res.send(result);
			});

	}
/* ------------------------------------------------------------------------------------------
* getPosts - Возвращает все посты для выбранный - Мои = 1 || Общие = 2 || Все = 3 || Избранные = 4
* вызывает одну из трех функций 
* 1) Мои = filterMy 
* 2) Общие = filterCommon
* 3) Все = filterAll
* 4) Все = filterFavorite
*/ 
	function getPosts(res, filter, userId) {
		var results = [];
		switch(filter) {
			case 1:
				filterMy(res, userId);
				break;
			case 2:
				filterCommon(res, userId);
				break;
			case 3:
				filterAll(res, userId);
				break;
			case 4:
				filterFavorite(res, userId);
				break;
		}
	}
/* ------------------------------------------------------------------------------------------
* addPost
* Добавляем новый пост 
* добавляем всем Получателям id поста
* вызываем фунцию getPosts
* getPosts - Возвращает все посты для выбранный - Мои = 1 || Общие = 2 || Все = 3- 
*/
	app.post("/api/post", function(req, res) {
		var theme = req.body.theme;
		var text = req.body.text;
		var userId = req.body.userId;
		var userName = req.body.userName;
		var filter = req.body.filter;
		var userIds = req.body.userIds;

		var post = new Posts({
			theme: theme,
			text: text,
			date: Date.now(),
			answer: "",
			creator: userId,
			users: userIds,
			favorite: []
		});
		post.save(function(err, affected) {
			if(err) {
				res.statusCode = 500;
				res.send("Error");
			} else {
				console.log("post is successfully added");
				res.send("Ok");
			}
		});
	});

/* ------------------------------------------------------------------------------------------
* adToFavorite
* Добавить посты в избранное
*/
	app.post("/api/posts/addToFavourites", function(req, res) {
		var userId = req.body.userId;
		var postId = req.body.postId;
		Posts.findOne({_id: postId}, function(err, result) {
			var bool = result.favorite.indexOf(userId) == -1;
			if(bool) {
				Posts.update({_id: postId}, {$push: {favorite: userId}})
					.exec(function(err, affected) {
						if (err) res.send(err);
						else res.send("1");
					});
			} else {
				Posts.update({_id: postId}, {$pull: {favorite: userId}})
					.exec(function(err, affected) {
						if (err) res.send(err);
						else res.send("0");
					});
			}
		})
		
	})
/* ------------------------------------------------------------------------------------------
* deletePosts
* Удаляем чеканные посты
*/
	app.post("/api/posts/delete", function(req, res) {
		var listDelete = req.body.listDelete;
		for(var i = 0; i < listDelete.length; i++) {
			var postId = listDelete[i];
			Posts.remove({_id: postId})
				.exec(function(err, affected) {
					if(err) res.send(err);
				});
			Comments.remove({postId: postId})
				.exec(function(err, affected) {
					if(err) res.send(err);
				});
		}
		res.send("Ok");
	});
app.listen(8082, function() {
	console.log("Backend Started");
});