
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

// Подключаемя к -mongoDB
	mongoose.connect(config.get('Communication.dbConfig.host'));

app.listen(8082, function() {
	console.log("Backend Started");
});