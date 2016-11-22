var Users = require("./app/models/user.js").Users;

Users.find({}, function(err, result) {
	console.log(result);
});