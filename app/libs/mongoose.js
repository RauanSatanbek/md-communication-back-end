var mongoose = require("mongoose");
var config = require("../config/index.js");
mongoose.connect(config.get("mongoose").uri, config.get("mongoose").options);
module.exports = mongoose;