var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var company = require('./routes/companies');
var product = require('./routes/products');
var Device = require('./routes/devices');
var app = express();

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongodb', {
    useMongoClient: true
    /* other options */
});
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('connected to mongodb server');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', users);
app.use ('/api',Device);
app.use('/api', company);

app.use('/api', product);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not found.');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
});

module.exports = app;
