var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

var index = require('./routes/index');
var users = require('./routes/users');
console.log("users = ",users);
var commits = require('./routes/commits');
var files = require('./routes/files');
var projects = require('./routes/projects');
var authent = require('./routes/auth');
console.log("auth = ",authent);

var app = express(),auth = require('express-jwt-token'), router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongoose.connect("mongodb://127.0.0.1:27017/gitdb",{server:{
  socketOptions : {keepAlive : 1}
}});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

router.all('/commit/*', auth.jwtAuthProtected);
router.all('/file/*', auth.jwtAuthProtected);
router.all('/project/*', auth.jwtAuthProtected);
router.all('/user/*',auth.jwtAuthProtected);
 
app.use('/',router);
app.use('/', index);
app.use('/user', users);
app.use('/commit',commits);
app.use('/file',files);
app.use('/project',projects);
app.use('/auth',authent);
 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
