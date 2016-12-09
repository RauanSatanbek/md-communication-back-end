/* ------------------------------------------------------------------------------------------
* Подключаем все коллекций
*/
var express = require("express"),
	router = express.Router(),
	postController = require("../controllers/postsController"),
	commentController = require("../controllers/commentsController"),
	userController = require("../controllers/usersController");


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