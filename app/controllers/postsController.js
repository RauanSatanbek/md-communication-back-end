var Post = require("../models/post");
/* ------------------------------------------------------------------------------------------
* getPost
* Возвращаем выбранный пост
*/
	module.exports.getPost = function(req, res, next){
		Post.findOne({_id: req.params.id}, function(err, result) {
			if(err) {
				res.statusCode = 500;
				res.send(err);
				console.log(err);
			} else {
				res.send(result);
				console.log(result);
			}
		});
	}
/* ------------------------------------------------------------------------------------------
* getPosts - Фильтрация
* вызываем фунцию getPosts
* getPosts - Возвращает все посты для выбранный - Мои = 1 || Общие = 2 || Все = 3- 
*/
	module.exports.getPosts = function(req, res, next){
		var m = req.params.m.split(":");
		var userId = m[0];
		var filter = parseInt(m[1]);
		// get all post with filter 
			getPosts(res, filter, userId);
	};
		
/* ------------------------------------------------------------------------------------------
* get all post - Фильтрация (функций)
* Возвращаем все посты для выбранный - Мои || Общие || Все -
*/ 
// Мои
	function filterMy(res, userId) {
		Post.find({creator: userId})
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
		Post.find({users: userId})
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
		Post.find({$or: [{creator: userId}, {users: userId}]})
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
		Post.find({favorite: userId})
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
* 4) Избранные = filterFavorite
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
	module.exports.addPost = function(req, res, next){
		var theme = req.body.theme;
		var text = req.body.text;
		var userId = req.body.userId;
		var userName = req.body.userName;
		var filter = req.body.filter;
		var userIds = req.body.userIds;

		var post = new Post({
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
	};

/* ------------------------------------------------------------------------------------------
* addToFavourites
* Добавить посты в избранное
*/
	module.exports.addToFavourites = function(req, res, next){
		var userId = req.body.userId;
		var postId = req.body.postId;
		Post.findOne({_id: postId}, function(err, result) {
			var bool = result.favorite.indexOf(userId) == -1;
			if(bool) {
				Post.update({_id: postId}, {$push: {favorite: userId}})
					.exec(function(err, affected) {
						if (err) res.send(err);
						else res.send("1");
					});
			} else {
				Post.update({_id: postId}, {$pull: {favorite: userId}})
					.exec(function(err, affected) {
						if (err) res.send(err);
						else res.send("0");
					});
			}
		})
		
	};
/* ------------------------------------------------------------------------------------------
* deletePosts
* Удаляем чеканные посты
*/
	module.exports.deletePosts = function(req, res, next){
		var listDelete = req.body.listDelete;
		var userId = req.body.userId; 
		for(var i = 0; i < listDelete.length; i++) {
			var postId = listDelete[i];
			Post.remove({_id: postId, creator: userId})
				.exec(function(err, affected) {
					if(err) res.send(err);
				});
			Comment.remove({postId: postId})
				.exec(function(err, affected) {
					if(err) res.send(err);
				});
		}
		res.send("Ok");
	};