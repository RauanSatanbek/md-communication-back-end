var User = require('../models/User');

// module.exports.getAllUsers = function(req, res, next) {
// 	User.find({}, '_id name')
// 		.exec(function(error, answer){
// 			if(error) return next(error);
// 			res.send(answer);
// 		});
// }


/* ------------------------------------------------------------------------------------------
* getAllUsers
* гетим всех юзеров для - Получатели  
*/
    module.exports.getAllUsers = function(req, res, next) {
    	console.log(req);
		var userId = req.params.id;
		var query = User.find({}, '_id name');
		query.$where('this._id != "'+req.params.id+'"')
			.exec(function(err, result) {
				if(err) console.log(err);
				else {
					console.log(result);
					res.send(result);
				}
			});
	};

/* ------------------------------------------------------------------------------------------
* get user -
* гетим инфомацию о нашем юзере  
*/
	module.exports.getUser = function(req, res) {
		User.findOne({_id: req.params.id})
			.exec(function(err, result) {
				if(err) {
					res.statusCode = 500;
					res.send(err);
				} else {
		            console.log(result);
					res.send(result);
				}
			});
	};
