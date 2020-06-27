var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
  userId: String,
  bookId: String,
  title: String,
  isComplete: Boolean,
  amount: Number,
  books: Object
  }, { versionKey: false });

var Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');

module.exports = Transaction;
