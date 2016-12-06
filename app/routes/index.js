/* ------------------------------------------------------------------------------------------
* Подключаем все коллекций
*/
var express = require("express"),
	router = express.Router(),
	postController = require("../controllers/postsController"),
	commentController = require("../controllers/commentsController"),
	userController = require("../controllers/usersController");

// /* ------------------------------------------------------------------------------------------
// * get all users
// * гетим всех юзеров для - Получатели  
// */
// 	router.get("/api/user/select:id", function(req, res, next) {
// 		var userId = req.params.id;
// 		var query = User.find({});
// 		query.$where('this._id != "'+req.params.id+'"')
// 			.exec(function(err, result) {
// 				if(err) console.log(err);
// 				else {
// 					console.log(result);
// 					res.send(result);
// 				}
// 			});
// 	});
// /* ------------------------------------------------------------------------------------------
// * get user -
// * гетим инфомацию о нашем юзере  
// */
// 	router.get("/api/user/:id", function(req, res) {
// 		User.findOne({_id: req.params.id})
// 			.exec(function(err, result) {
// 				if(err) {
// 					res.statusCode = 500;
// 					res.send(err);
// 				} else {
// 		            console.log(result);
// 					res.send(result);
// 				}
// 			});
// 	});
// -----------------------------------------------------------------------
// addComment
	router.post("/api/comment", commentController.addComment);
// getComment
	router.post("/api/comment/:postId", commentController.getComment);
// -----------------------------------------------------------------------
// getPost Возвращаем выбранный пост
	router.post("/api/post/:id", postController.getPost);
// getPosts - Фильтрация
	router.get("/api/posts/:m", postController.getPosts);
// addPost
	router.post("/api/post", postController.addPost);
// addToFavourites Добавить посты в избранное
	router.post("/api/posts/addToFavourites", postController.addToFavourites);
// deletePosts Удаляем чеканные посты
	router.post("/api/posts/delete", postController.deletePosts);

module.exports = router;