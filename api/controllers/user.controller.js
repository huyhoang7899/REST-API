var Transaction = require('../../models/transaction.model');
var User = require('../../models/user.model');
var Book = require('../../models/book.model');

module.exports.index = async function(req, res) {
  var users = await User.find();

  res.json(users);
}

module.exports.search = async function(req, res) {
  var id = req.params.id;
  var user = await User.findById(id);

  res.json(user);
}

module.exports.create = async function(req, res) {
  var user = await User.create(req.body);

  res.json(user);
}

module.exports.delete = async function(req, res) {
  var id = req.params.id;
  var user = await User.findByIdAndDelete(id);

  res.json(user);
}

module.exports.update = async function(req, res) {
  var id = req.params.id;
  await User.findByIdAndUpdate(id, req.body);

  res.json(req.body);
}
