var mongoose = require('mongoose');

var user = new mongoose.Schema({
	userName:String,
  email: String,
  pass: String
});

module.exports = user;