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
	app.get("/api/user", function(req, res, next) {
		Users.find(function(err, result) {
			if(err) console.log(err);
			else res.send(result);
		});
	});
/* ------------------------------------------------------------------------------------------
* get user
* гетим инфомацию о нашем юзере  
*/
	app.get("/api/user/:id", function(req, res) {
		Users.findOne({_id: req.params.id}, function(err, result) {
			if(err) {
				res.statusCode = 500;
				res.send("error");
			} else {
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
		var userName = req.body.userName;
		var date = Date.now();
		Posts.update({_id: postId}, {$set: {answer: date}}, function(err, affected) {
			if(err) console.log("error");
		});
		var comment = new Comments({
			userName: userName,
			userId: userId,
			postId: postId,
			text: text,
			date: Date.now()
		});
		comment.save(function(err, affected) {
			if(err) {
				res.statusCode = 500;
				res.send(err);
			} else {
				Comments.find({postId: postId}, function(err, result) {
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
		Comments.find({postId: postId}, function(err, result) {
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
		Posts.find({creator: userId}, function(err, result) {
			if(err) {
				res.statusCode = 500;
				res.send(err);
			}
			else res.send(result);
		});
	}
// Общие
	function filterCommon(res, userId) {
		Users.findOne({_id: userId}, function(err, result) {
			var postIds = result.posts.split(":");
			var str = "";
			var c = " || ";
			for(var i = 0; i < postIds.length; i++) {
				if(i + 1 == postIds.length) c = "";
				var str = str + "this._id == " + "'" + postIds[i] + "'" + c;
			}
			var query = Posts.find({});
				query.$where(str).exec(function(err, result) {
				if(err) {
					res.statusCode = 500;
					res.send(err);
				}
				else res.send(result);
			});
		});
	}
// Все
	function filterAll(res, userId) {
		Users.findOne({_id: userId}, function(err, result) {
			var postIds = result.posts.split(":");
			var str = "this.creator == '"+userId+"' || ";
			var c = " || ";
			for(var i = 0; i < postIds.length; i++) {
				if(i + 1 == postIds.length) c = "";
				var str = str + "this._id == " + "'" + postIds[i] + "'" + c;
			}
			var query = Posts.find({});
			query.$where(str).exec(function(err, result) {
				if(err) {
					res.statusCode = 500;
					res.send(err);
				}
				else {
					res.send(result);
				}
			});
		});
	}
/* ------------------------------------------------------------------------------------------
* getPosts - Возвращает все посты для выбранный - Мои = 1 || Общие = 2 || Все = 3 - 
* вызывает одну из трех функций 
* 1) Мои = filterMy 
* 2) Общие = filterCommon
* 3) Все = filterAll
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
		var tema = req.body.tema;
		var text = req.body.text;
		var userId = req.body.userId;
		var userName = req.body.userName;
		var filter = req.body.filter;

		var userIds = req.body.userIds;
		var post = new Posts({
			tema: tema,
			text: text,
			date: Date.now(),
			answer: "",
			creator: userId,
			creatorName: userName
		});
		post.save(function(err, affected) {
			if(err) {
				res.statusCode = 500;
				res.send("Error");
			} else {
				getPosts(res, filter, userId);
				Posts.find({}, function(err, result) {
					if(err){
						res.statusCode = 500;
						res.send(err);
					} else {
						var postId = result[result.length - 1]._id;
						for(var i = 0; i < userIds.length; i++) {
							var userId = userIds[i];
							Users.findOne({_id: userId}, function(err, result2) {
								if(err){
									res.statusCode = 500;
									res.send(err);
								} else {
									var postsId = result2.posts;
									console.log(result2);
									if(postsId == undefined) {
										console.log("empty", postsId);
										Users.update({_id: userId}, {$set: {posts: postId}}, function(err, affected) {
											if(err) console.log(err);
											
										});
									} else {
										console.log("not empty", postId);
										Users.update({_id: userId}, {$set: {posts: postsId + ":" + postId}}, function(err, affected) {
											if(err) console.log(err);
										});
									}
								}
							});
						}
					}
				});
			}
		});
	});
app.listen(1000, function() {
	console.log("Backend Started");
});

// async.waterfall([
//     function (done) {
//         KeyWord.findById(req.params.id, function(err, key) {
//             if (err) return next(err);
//             done(null, key);
//         });
//     },
//     function(key, done) {
//         key.user = req.body.user;
//         key.word = req.body.word;
//         key.save(function(err) {
//             if (err) return next(err);
//             done(err, key);
//         });
//     }
// ], function(err, key){
//     if(err) return next(err);
//     res.status(200).send({ keyword: key, message: 'Success'});
// });

// if(err) {
//         res.statusCode = 500;
//         res.send("Error");
//       } else {
//         getPosts(res, filter, userId);
//         Posts.find({}, function(err, result) {
//           if(err){
//             res.statusCode = 500;
//             res.send(err);
//           } else {
//             var postId = result[result.length - 1]._id;
//             for(var i = 0; i < userIds.length; i++) {
//               var userId = userIds[i];
//               Users.findOne({_id: userId}, function(err, result2) {
//                 if(err){
//                   res.statusCode = 500;
//                   res.send(err);
//                 } else {
//                   var postsId = result2.posts;
//                   console.log(result2);
//                   if(postsId == undefined) {
//                     console.log("empty", postsId);
//                     Users.update({_id: userId}, {$set: {posts: postId}}, function(err, affected) {
//                       if(err) console.log(err);
//                     });
//                   } else {
//                     console.log("not empty", postId);
//                     Users.update({_id: userId}, {$set: {posts: postsId + ":" + postId}}, function(err, affected) {
//                       if(err) console.log(err);
//                     });
//                   }
//                 }
//               });
//             }
//           }
//         });
//       }