/* Dependencies */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

/* Pages */
var index = require('./routes/index');
var api = require('./routes/api');

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

app.use('/', index);
app.use('/api', api);

app.post('/refresh_products', function(req, res) {
  /* Get products from API */
  request("https://ine5646products.herokuapp.com/api/products", function(error, response, body) {
    if(error) {
      console.log("Error: ", error);
    } else {  
      console.log('Status code:', response && response.statusCode);
      console.log('Body:', body);
    }
  });

  /* Connect to the database */
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('athena.db', (err) => {
    if(err) {
      return console.error(err.message);
    } else {
      console.log("Connected to the SQLite database.");
    }
  });
  db.close();
});

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
