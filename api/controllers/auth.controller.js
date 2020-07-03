require('dotenv').config();
var axios = require('axios');
var jwt = require('jsonwebtoken');
var User = require('../../models/user.model');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const bcrypt = require('bcrypt')

module.exports.postLogin = async function(req, res) {
  var { email, password} = req.body;

  var user = await User.findOne({ email: email });

  if (!user) {
    res.json({
      errors: [ "Email does not exist !" ],
      success: false
    });
    return;
  }

  // if (!user.wrongLoginCount) {
  //   await User.findOneAndUpdate({ email: email }, {
  //     $set: {
  //       wrongLoginCount: 0
  //     }
  //   });
  // }

  // if (user.wrongLoginCount >= 4) {
  //   res.json({
  //     errors: [ "Your account has been locked !" ],
  //     values: req.body
  //   });
    // res.render('auth/login', {
    //   errors: [ "Your account has been locked !" ],
    //   values: req.body
    // });

  //   var transporter = nodemailer.createTransport(smtpTransport({
  //   service: 'gmail',
  //   host: 'smtp.gmail.com',
  //   auth: {
  //     user: process.env.SESSION_USER,
  //     pass: process.env.SESSION_PASSWORD
  //     }
  //   }));

  //   var mailOptions = {
  //     from: 'somerealemail@gmail.com',
  //     to: req.body.email,
  //     subject: 'Enter the wrong password !',
  //     text: 'Your account has logged in incorrectly too many times. Please check again.'
  //   };

  //   transporter.sendMail(mailOptions, function(error, info){
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log('Email sent: ' + info.response);
  //     }
  //   });

  //   return;
  // }

  var checkPassword = await bcrypt.compare(req.body.password, user.password)

  if (!checkPassword) {
    await User.findOneAndUpdate({ email: email }, { wrongLoginCount: (user.wrongLoginCount += 1) });

    res.json({
      errors: [ "Password Wrong !" ],
      success: false
    });

    return;
  }

  var payload = { id: user.id };
  var accessToken = jwt.sign(payload, "addqwe1323", { expiresIn: 60 * 60 });

  res.json({ success: true, accessToken});

}
