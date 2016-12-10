




var compression = require('compression');
var express = require('express');

var path = require('path');
var logger = require('morgan');
var http = require('http');
var cors = require('cors');
var config = require('config');
var multer = require('multer');
var mongoose = require('mongoose');

require('mongoose-double')(mongoose);

/*var fs = require('fs');*/

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var async = require('async');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var nodemailer = require('nodemailer');



console.log(config.get('Communication.dbConfig'));
// mongoose.connect(config.get('Tasks.dbConfig.host'));

// Подключаемя к -mongoDB
	mongoose.connect(config.get('Communication.dbConfig.host'));

var app = express();

// app.use(formidable);

// Middlewares
app.use(cors());
app.set('port', process.env.PORT || 8082);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(formidable({
//   encoding: 'utf-8',
//   uploadDir: __dirname+'/uploads',  
//   multiples: true, // req.files to be arrays of files 
//   keepExtensions: true,
//   on: function('fileBegin', ) {
//       // body...
//   }
// }));

app.use(session({ secret: 'some key',
    resave:  true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public'), { maxAge: 1 }));

// app.use(require('./server/routes'));
var routes = require('./app/routes/index');
var auth = require('./app/routes/auth');
app.use('/', routes);
app.use('/', auth);


// Use of Passport user after login
app.use(function(req, res, next) {
    if (req.user) {
        res.cookie('user', JSON.stringify(req.user));
    }
    next();
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
});

// Create Server
var server = http.createServer(app);


// Start server
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});