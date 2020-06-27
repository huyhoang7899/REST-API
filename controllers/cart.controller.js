var Session = require('../models/session.model');
var Book = require('../models/book.model');
var Transaction = require('../models/transaction.model');

module.exports.index = async function(req, res) {
  var sessionId = req.signedCookies.sessionId;
  var items = await Session.findOne({ sessionId: sessionId });

  var booksItem = []
  for(var item in items.cart) {
    var book = await Book.findById(item);
    book.amount = items.cart[item];
    booksItem.push(book);
  }

  res.render('cart/index', {
    booksItem: booksItem
  });
}

module.exports.addToCart = async function(req, res) {
  var bookId = req.params.bookId;
  var sessionId = req.signedCookies.sessionId;

  if(!sessionId) {
    res.redirect('/books');
    return;
  }

  await Session.findOneAndUpdate({ sessionId: sessionId }, {
    $inc: { ['cart.' + bookId]: 1 }
  })

  res.redirect('/books')

};

module.exports.rental = async function (req, res) {
  var userId = req.signedCookies.userId;
  var sessionId = req.signedCookies.sessionId;
  var transaction = await Transaction.findOne({ userId: userId});
  var items = await Session.findOne({ sessionId: sessionId });

  var books = []
  for(var item in items.cart) {
    var book = await Book.findById(item).lean();
    book.isComplete = false;
    book.amount = items.cart[item];
    book.bookId = item;
    delete book._id;
    delete book.coverUrl;
    delete book.description;
    books.push(book);
  }
  await Transaction.insertMany({userId: userId, books: books});

  res.clearCookie("sessionId");

  res.redirect('/transactions');

}
