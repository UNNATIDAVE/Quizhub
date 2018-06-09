var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var errorHandler = require('express-error-handler');
var methodOverride = require('method-override');

// Models
var userModel = require('./models/users.js');

// Controllers
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var apis = require('./controllers/api');
mongoose.Promise = global.Promise;

//db connection
/*mongoose.connect(dbPath || process.env.MONGODB_URI );
mongoose.connection.once('open',function(){
  console.log("Database Connection Established Successfully.");
});
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  //process.exit(1);
});
*/
mongoose.connect("mongodb://localhost/qui",{useMongoClient: true});
var db = mongoose.connection;

db.once('open', function(){
  console.log("Databse connected successfully !!!!!!");
});

//app settings
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './../client')));

app.use(function(req, res, next) {
  req.isAuthenticated = function() {
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
    try {
      return jwt.verify(token, "875916b9aa8591781khiladi287df573c07ed56ecc697ebb88b744329af117468be5953");
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    var payload = req.isAuthenticated();
    userModel.findById(payload.sub, function(err, user) {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});

app.post('/contact', contactController.contactPost);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.post('/signup', userController.signupPost);
app.post('/login', userController.loginPost);
app.post('/forgot', userController.forgotPost);
app.post('/reset', userController.resetPost);
app.post('/auth/facebook', userController.authFacebook);
app.get('/auth/facebook/callback', userController.authFacebookCallback);
app.post('/auth/google', userController.authGoogle);
app.get('/auth/google/callback', userController.authGoogleCallback);

//including controllers files
app.use('/api',userController.ensureAuthenticated,  apis);

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

// error handler
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
});

app.use(errorHandler());

app.listen(3000, function() {
  console.log('Server listening on port: 3000');
});

module.exports = app;
