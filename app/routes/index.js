var express = require('express');
var router = express.Router();
var usersController = require('../controllers/usersController');
var tasksController = require('../controllers/tasksController');
var clientsController = require('../controllers/clientsController');

// TEST PAGE
router.get('/', function(req, res, next){
	res.send('GET');
});

// SHOW ALL USERS
router.get('/api/users/all', usersController.getAllUsers);

// CREATE TASKS
router.post('/api/tasks/create', tasksController.createTask);

// SHOW ALL TASKS
router.get('/api/tasks/all', tasksController.getAllTasks);

// SHOW ALL CLIENTS
router.get('/api/clients/all', clientsController.getAllClients);

// MAKE TASK FAVOURITE
router.post('/api/tasks/addToFavourites', tasksController.makeTaskFavourite);

// FILTERS
router.post('/api/tasks/filterBy', tasksController.filter);

// SELECT GENERAL(I AM PERFORMER OR AUDITOR)
router.post('/api/tasks/general', tasksController.getGeneralTasks)

// SELECT ONE TASK
router.post('/api/tasks/task', tasksController.selectTask);

module.exports = router;

















