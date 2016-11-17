var config = require("./config.json");

exports.get = function(name) {
	return config[name];
}