var User = require('../models/user.model');

module.exports.requireAdminTransaction = async function(req, res, next) {
  var user = await User.findById(req.signedCookies.userId);

  if(!user.isAdmin) {
    res.redirect('/transactions');
    return;
  }

  next();
}

module.exports.requireAdminBook = async function(req, res, next) {
  var user = await User.findById(req.signedCookies.userId);

  if(!user.isAdmin) {
    res.redirect('/books');
    return;
  }

  next();
}

module.exports.requireAdminUser = async function(req, res, next) {
  var user = await User.findById(req.signedCookies.userId);

  if(!user.isAdmin) {
    res.redirect('/users');
    return;
  }

  next();
}
