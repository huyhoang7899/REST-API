var Book = require('../models/book.model');
var User = require('../models/user.model');

module.exports.index = async function(req, res) {
  res.render('books/index',{
   books: await Book.find(),
   user: await User.findById(req.signedCookies.userId)
  });
}

module.exports.create = function(req, res) {
  res.render('books/create');
}

module.exports.update = async function(req, res) {
  var id = req.params.id;
  var book = await Book.findById(id);
  res.render('books/update', {
    book: book
  });
}

module.exports.delete = async function(req, res) {
  var id = req.params.id;
  await Book.findByIdAndRemove(id);
  res.redirect('back');
}

module.exports.search = async function(req, res) {
  var q = req.query.q;
  var userId = req.signedCookies.userId;
  var user = await User.findById(userId);
  var matchedBook = await Book.find();
  if(q) {
    matchedBook = matchedBook.filter(function(book) {
      return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })
  }
  res.render('books/index', {
    books: matchedBook,
    q: q,
    user: user
  });
}

module.exports.postCreate = function(req, res) {
  var pathBookCover = req.file.path;
  var cloudinary = require('cloudinary');

  cloudinary.config({
    cloud_name: process.env.SESSION_CLOUD_NAME,
    api_key: process.env.SESSION_API_KEY,
    api_secret: process.env.SESSION_API_SECRET
  });

  cloudinary.v2.uploader.upload(pathBookCover, async function(error, result) {
    req.body.coverUrl = result.url;
    await Book.insertMany(req.body);
    res.redirect('/books');
  });
}

module.exports.postUpdate = async function(req, res) {
  var id = req.body.id;
  await Book.findByIdAndUpdate(id, { title: req.body.title, description: req.body.description});
  res.redirect('/books');
}
