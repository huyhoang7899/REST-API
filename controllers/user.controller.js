var User = require('../models/user.model');
const shortid = require('shortid');

module.exports.index = async function(req, res) {
  var id = req.signedCookies.userId;
  var page = parseInt(req.query.page) || 1;
  var perPage = 8;
  var drop = (page - 1) * perPage;
  var users = await User.find().limit(perPage).skip(drop);

  // var users = db.get('users').drop(drop).take(perPage).value();
  var totalUser = await User.find();
  var totalPage = Math.ceil(totalUser.length / perPage);

  res.render('users/index', {
    users: users,
    userLogin: await User.findById(id),
    nextPage: page + 1,
    prePage: page - 1,
    totalPage: totalPage,
    page: page
  });
}

module.exports.create = function(req, res) {
  res.render('users/create');
}

module.exports.views = async function(req, res) {
  var id = req.params.id;
  var user = await User.findById(id);
  res.render('users/views', {
    user: user
  })
}

module.exports.update = async function(req, res) {
  var id = req.params.id;
  var user = await User.findById(id);
  res.render('users/update', {
    user: user
  })
}

module.exports.delete = async function(req, res) {
  var id = req.params.id;
  await User.findByIdAndRemove(id)
  res.redirect('back');
}

module.exports.search = async function(req, res) {
  var q = req.query.q;
  var userId = req.signedCookies.userId;
  var user = await User.findById(userId);
  var matchedUser = await User.find();
  if(q) {
    matchedUser = matchedUser.filter(function(user) {
			return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
		});
  }
  res.render('users/index', {
    users: matchedUser,
    q: q,
    userLogin: user
  })
}

module.exports.postCreate = async function(req, res) {
  await User.insertMany(req.body);
  res.redirect('/users');
}

module.exports.postUpdate = async function(req, res) {
  var id = req.body.id;
  await User.findByIdAndUpdate(id, { name: req.body.name, age: req.body.age, address: req.body.address, phone: req.body.phone })
  res.redirect('/users');
}
