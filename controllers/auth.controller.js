require('dotenv').config();
var User = require('../models/user.model');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const bcrypt = require('bcrypt')

module.exports.login = function(req, res) {
  res.render('auth/login');
}

module.exports.postLogin = async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var user = await User.findOne({ email: email });

  if (!user) {
    res.render('auth/login', {
      errors: [ "Email does not exist !" ],
      values: req.body
    });
    return;
  }

  if (!user.wrongLoginCount) {
    await User.findOneAndUpdate({ email: email }, {
      $set: {
        wrongLoginCount: 0
      }
    });
  }

  if (user.wrongLoginCount >= 4) {
    res.render('auth/login', {
      errors: [ "Your account has been locked !" ],
      values: req.body
    });

    var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.SESSION_USER,
      pass: process.env.SESSION_PASSWORD
      }
    }));

    var mailOptions = {
      from: 'somerealemail@gmail.com',
      to: req.body.email,
      subject: 'Enter the wrong password !',
      text: 'Your account has logged in incorrectly too many times. Please check again.'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return;
  }

  var checkPassword = await bcrypt.compare(req.body.password, user.password)

  if (!checkPassword) {
    await User.findOneAndUpdate({ email: email }, { wrongLoginCount: (user.wrongLoginCount += 1) });

    res.render('auth/login', {
      errors: [ "Password Wrong !" ],
      values: req.body
    });
    return;
  }

  await User.findOneAndUpdate({ email: email }, { wrongLoginCount: 0 });

  res.cookie("userId", user.id, {
    signed: true
  });

  res.redirect('/profile');
}
