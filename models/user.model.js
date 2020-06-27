var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: String,
  age: String,
  address: String,
  phone: Number,
  email: String,
  password: String,
  isAdmin: Boolean,
  wrongLoginCount: Number,
  avatarUrl: String
  });

var User = mongoose.model('User', userSchema, 'users');

module.exports = User;
