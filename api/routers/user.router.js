var express = require('express');
var controller = require('../controllers/user.controller');
//var authMiddleware = require('../middlewares/auth.middleware');

var router = express.Router();

router.get('/', controller.index);

router.get('/:id', controller.search);

router.post('/', controller.create);

router.delete('/:id', controller.delete);

router.put('/:id', controller.update);

module.exports = router;
