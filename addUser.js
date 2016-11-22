var Users = require("./app/models/user.js").Users;

var users = [{_id: "582022bd000bb408b0498b09", name: "Аэлита Кулагинa", avatar: "https://encrypted-tbn1.gstatic.com/images?q=tbn:AN…7XmgLfLPpB2aO_I4-7ir7KkZfz4hUMXSuAgPdJ44eFGWm31E-", posts: ""},
			{_id: "582022bd000bb408b0498b0a", name: "Андрей Павлов", avatar: "https://s3.eu-central-1.amazonaws.com/image.welove…s/2015/09/09/97a126c5b2834d4eb8755714fba2bcee.jpg", posts: ""},
			{_id: "582022bd000bb408b0498b0b", name: "Коля Павлов", avatar: "http://litanons.ru/vk/img.php?url=http://cs630921.vk.me/v630921507/339ca/LCqxUyIWzcE.jpg", posts: ""}];
for(var i = 0; i < 3; i++) {
	var user = new Users({
		name: users[i].name,
		avatar: users[i].avatar,
		posts: users[i].posts
	});
	user.save();
}
//dsa

