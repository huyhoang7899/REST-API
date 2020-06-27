var User = require('../models/user.model');
var cloudinary = require('cloudinary');

module.exports.index = async function(req, res) {
  var id = req.signedCookies.userId;
  var user = await User.findById(id);
   if(!user.avatarUrl) {
    await User.findByIdAndUpdate(id, {
      $set: { avatarUrl: 'https://res.cloudinary.com/huyhoang/image/upload/v1592217733/qrsdkpnljrtvg52crqzh.png' }
    });
   }
  res.render('./profile/index.pug', {
    user: user
  });
}

module.exports.avatar = async function(req, res) {
  var id = req.signedCookies.userId;
  var user = await User.findById(id);
  res.render('./profile/avatar.pug', {
    user: user
  });
}

module.exports.postAvatar = async function(req, res) {
  req.body.pathAvatar = req.file.path;
  var id = req.signedCookies.userId;
  var user = await User.findById(id);

  cloudinary.config({
    cloud_name: process.env.SESSION_CLOUD_NAME,
    api_key: process.env.SESSION_API_KEY,
    api_secret: process.env.SESSION_API_SECRET
  });

  cloudinary.v2.uploader.upload(req.body.pathAvatar, async function(error, result) {
    await User.findByIdAndUpdate(id, { avatarUrl: result.url });
  });

  res.redirect('/profile');
}
