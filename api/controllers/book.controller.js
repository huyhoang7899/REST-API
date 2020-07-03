var Transaction = require('../../models/transaction.model');
var User = require('../../models/user.model');
var Book = require('../../models/book.model');

module.exports.index = async function(req, res) {
  var books = await Book.find();

  res.json(books);
}

module.exports.search = async function(req, res) {
  var id = req.params.id;
  var book = await Book.findById(id);

  res.json(book);
}

module.exports.create = async function(req, res) {
  var book = await Book.create(req.body);

  res.json(book);
}

module.exports.delete = async function(req, res) {
  var id = req.params.id;
  var book = await Book.findByIdAndDelete(id);

  res.json(book);
}

module.exports.update = async function(req, res) {
  var id = req.params.id;
  await Book.findByIdAndUpdate(id, req.body);

  res.json(req.body);
}
