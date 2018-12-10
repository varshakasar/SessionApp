var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	userName:String,
  email: String,
  pass: String
});

module.exports = userSchema;