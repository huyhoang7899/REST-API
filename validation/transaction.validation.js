var Transaction = require('../models/transaction.model');

module.exports.complete = async function(req, res, next) {
  var userId = req.params.userId;
  var transaction = await Transaction.findOne({ userId: userId });
  if (!transaction) {
     res.render('transaction/index', {
      transactions: db.get('transactions').value(),
      error: "Not found ID in transactions !"
      });
  }
  next();
}
