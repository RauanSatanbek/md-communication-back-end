
var express = require("express"),
	bodyParser = require("body-parser"),
	cors = require("cors"),
	config = require('config'),
	fs = require("fs"),
	app = express(),
    routes = require('./app/routes/index'),
    auth = require('./app/routes/auth'),
	mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser());
app.use('/', routes);
app.use('/', auth);

var User = require("./app/models/User");

// Подключаемя к -mongoDB
	mongoose.connect(config.get('Communication.dbConfig.host'));


/* ------------------------------------------------------------------------------------------
* get all users
* гетим всех юзеров для - Получатели  
*/
	app.get("/api/user/select/:id", function(req, res, next) {
		var userId = req.params.id;
		var query = User.find({});
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
* get user -
* гетим инфомацию о нашем юзере  
*/
	app.get("/api/user/:id", function(req, res) {
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
	});
app.listen(8082, function() {
	console.log("Backend Started");
});