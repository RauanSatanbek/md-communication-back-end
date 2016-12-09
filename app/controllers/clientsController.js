var Client = require('../models/Client');

module.exports.getAllClients = function(req, res, next) {
	Client.find({}, '_id name nameCompany')
		.exec(function(error, answer){
			if(error) return next(error);
			res.send(answer);
		});
}
