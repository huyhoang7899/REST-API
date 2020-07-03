var jwt = require('jsonwebtoken');
const axios = require('axios');

module.exports.requireAuth = async function(req, res, next) {
var token = req.headers['x-auth'];
  jwt.verify(token, 'addqwe1323', function(err, decoded) {
    if(err) {
      return res.json({ error: "Wrong Token" })
    }
  });
  next();
}

