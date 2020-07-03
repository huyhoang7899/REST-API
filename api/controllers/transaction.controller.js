var Transaction = require('../../models/transaction.model');
var User = require('../../models/user.model');
var Book = require('../../models/book.model');

module.exports.index = async function(req, res) {
  var transactions = await Transaction.find();

  res.json(transactions);
}

module.exports.search = async function(req, res) {
  var id = req.params.id;
  var transaction = await Transaction.findById(id);

  res.json(transaction);
}

module.exports.create = async function(req, res) {
  var transaction = await Transaction.create(req.body);

  res.json(transaction);
}

module.exports.delete = async function(req, res) {
  var id = req.params.id;
  var transaction = await Transaction.findByIdAndDelete(id);

  res.json(transaction);
}

module.exports.update = async function(req, res) {
  var id = req.params.id;
  await Transaction.findByIdAndUpdate(id, req.body);

  res.json(req.body);
}
