var Transaction = require('../models/transaction.model');
var User = require('../models/user.model');
var Book = require('../models/book.model');

module.exports.index = async function(req, res) {
  var userId = req.signedCookies.userId;
  var user = await User.findById(userId);
  var transactions = await Transaction.find();

  if (!user.isAdmin) {
    transactions = await Transaction.find({ userId: userId });
  }

  res.render('transaction/index', {
    transactions: transactions,
    user: user
  });
}

module.exports.create = async function(req, res) {
  res.render('transaction/create', {
    users: await User.find(),
    books: await Book.find()
  });
}

module.exports.update = async function(req, res) {
  var userId = req.params.userId;
  var bookId = req.params.bookId;
  var transaction = await Transaction.findOne({ userId: userId });

  var book = transaction.books.find(function(item) {
    return item.bookId === bookId
  });

  res.render('transaction/update', {
    transaction: transaction,
    book: book
  });
}

module.exports.delete = async function(req, res) {
  var userId = req.params.userId;
  var bookId = req.params.bookId;

  var transaction = await Transaction.findOne({ userId: userId });

  for (var i = 0; i < transaction.books.length; i++) {
    if (transaction.books[i].bookId === bookId) {
      transaction.books.splice(i, 1);
    }
  }

  await Transaction.findOneAndUpdate({ userId: userId }, { books: transaction.books });
  res.redirect('back');
}

module.exports.search = async function(req, res) {
  var userId = req.signedCookies.userId;
  var user = await User.findById(userId);
  var q = req.query.q;
  var matchedTransaction = await Transaction.find();
  if(q) {
    matchedTransaction = matchedTransaction.filter(function(transaction) {
      return transaction.userId.toLowerCase().indexOf(q.toLowerCase()) != -1;
    });
  }

  res.render('transaction/index', {
    transactions: matchedTransaction,
    q: q,
    user: user
  })
}

module.exports.postCreate = async function(req, res) {
  var userId = req.body.userId;
  var bookId = req.body.bookId;
  var transaction = await Transaction.findOne({ userId: userId});
  var book = await Book.findById(bookId);
  var books = [];

  req.body.isComplete = false;
  req.body.title = book.title;
  delete req.body.userId;
  books.push(req.body)

  if(!transaction) {
    await Transaction.insertMany({userId: userId, books: books});
    res.redirect('/transactions');
    return;
  }

  transaction.books.push(req.body);
  await Transaction.findOneAndUpdate({ userId: userId }, { books: transaction.books})
  res.redirect('/transactions');
}

module.exports.postUpdate = async function(req, res) {
  var userId = req.params.userId;
  var bookId = req.params.bookId;

  var transaction = await Transaction.findOne({ userId: userId });

  for (var book of transaction.books) {
    if (book.bookId === bookId) {
       book.bookId = req.body.bookId;
       book.title = req.body.title;
       book.amount = req.body.amount
       break;
    }
  }
  await Transaction.findOneAndUpdate({ userId: userId }, { books: transaction.books})
  res.redirect('/transactions');
}

module.exports.complete = async function(req, res) {
  var userId = req.params.userId;
  var bookId = req.params.bookId;

  var transaction = await Transaction.findOne({ userId: userId });

  for (var book of transaction.books) {
    if (book.bookId === bookId) {
      book.isComplete = true
      break;
    }
  }

  await Transaction.findOneAndUpdate({ userId: userId }, { books: transaction.books});
  res.redirect('/transactions');
}
