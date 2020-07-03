var express = require('express');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var port = 3000;

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

var userRouter = require('./routers/user.router');
var bookRouter = require('./routers/book.router');
var transactionRouter = require('./routers/transaction.router');
// var middlewareCookie = require("./middlewares/cookie.middleware");
var authRouter = require('./routers/auth.router');
var profileRouter = require('./routers/profile.router');
var authMiddleware = require('./middlewares/auth.middleware');
var cartRouter = require('./routers/cart.router');
var sessionMiddleware = require('./middlewares/session.middleware');
var apiAuthRouter = require('./api/routers/auth.router');
var apiTransactionRouter = require('./api/routers/transaction.router');
var apiBookRouter = require('./api/routers/book.router');
var apiUserRouter = require('./api/routers/user.router');


var app = express();
app.use(cors())

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser('qGMCswAGm7ai6Xpp9STG'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('./dist'));
app.use(express.static('public'));
app.use(sessionMiddleware);

app.get('/', authMiddleware.requireAuth, function(req, res) {
   res.render('index');
});

app.get('/', (req, res) => res.sendFile('index.html'))

// app.use(middlewareCookie.cookie);
app.use('/users', authMiddleware.requireAuth, userRouter);
app.use('/books', bookRouter);
app.use('/transactions', authMiddleware.requireAuth, transactionRouter);
app.use('/auth', authRouter);
app.use('/profile',authMiddleware.requireAuth, profileRouter);
app.use('/cart', cartRouter);
app.use('/api/auth', apiAuthRouter);
app.use('/api/transactions', apiTransactionRouter);
app.use('/api/books', apiBookRouter);
app.use('/api/users', apiUserRouter);


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
