/* Dependencies */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* JavaScript files for each page */
var index = require('./routes/index');
var api = require('./routes/api');
var api_bids = require('./routes/api_bids');
var api_products = require('./routes/api_products');
var api_products_in_biddings = require('./routes/api_products_in_biddings');
var api_enabled_products = require('./routes/api_enabled_products');
var time = require('./routes/time');
var refresh_products = require('./routes/refresh_products');

/* Initialize application */
var app = express();

/* Set port and start listening */
app.set('port', (process.env.PORT || 8000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/* View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Paths for each page */
app.use('/', index);
app.use('/api', api);
app.use('/api/bids', api_bids);
app.use('/api/products', api_products);
app.use('/api/products_in_biddings', api_products_in_biddings);
app.use('/api/enabled_products', api_enabled_products);
app.use('/time', time);
app.use('/refresh_products', refresh_products);

/* Catch 404 and forward to error handler */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* Error handler */
app.use(function(err, req, res, next) {
  /* Set locals, only providing error in development */
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /* Render the error page */
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
