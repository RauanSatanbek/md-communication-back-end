var User = require('../models/User');

module.exports.getAllUsers = function(req, res, next) {
	User.find({}, '_id name')
		.exec(function(error, answer){
			if(error) return next(error);
			res.send(answer);
		});
}

var users = [
	{name: "Cristopher Vaquera", password: "123456", idToEnter: "16IT01", statusCompany: "", nameCompany: "", representative: "", telephone: "87754897898", email: "sideswipe@trephination.com"},
	{name: "Dwight Voglund", password: "123456", idToEnter: "16IT02", statusCompany: "", nameCompany: "", representative: "", telephone: "877745678998", email: "multimetalic@ephyra.edu"},
	{name: "Britt Westall", password: "123456", idToEnter: "16IT03", statusCompany: "", nameCompany: "", representative: "", telephone: "87756548978", email: "berkowitz@nonevidential.net"},
	{name: "Ismael Lafon", password: "123456", idToEnter: "16IT04", statusCompany: "", nameCompany: "", representative: "", telephone: "87781236545", email: "vinal@caucasic.org"},
	{name: "Brendon Fuchs", password: "123456", idToEnter: "16IT05", statusCompany: "", nameCompany: "", representative: "", telephone: "87714569878", email: "airlike@aforesaid.edu"},
	{name: "German Delfavero", password: "123456", idToEnter: "16IT06", statusCompany: "", nameCompany: "", representative: "", telephone: "87774569878", email: "cantoral@scriptorium.edu"},
];

// for (var i = 0; i < users.length; i++) {
// 	var user = new User({
// 		name: users[i].name,
// 	    password: users[i].password,
// 	    idToEnter: users[i].idToEnter,
// 	    statusCompany: users[i].statusCompany,
// 	    nameCompany: users[i].nameCompany,
// 	    representative: users[i].representative,
// 	    telephone: users[i].telephone,
// 	    email: users[i].email
// 	});

// 	user.save(function(err, affected) {
// 		if(err) console.log(err);
// 		else console.log(affected);
// 	});
// }