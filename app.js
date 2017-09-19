/* Dependencies */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var sqlite3 = require('sqlite3').verbose();
var parseJSON = require('json-parse-async');

/* Pages */
var index = require('./routes/index');
var api = require('./routes/api');
var api_bids = require('./routes/api_bids');
var api_products = require('./routes/api_products');
var api_products_in_biddings = require('./routes/api_products_in_biddings');
var api_enabled_products = require('./routes/api_enabled_products');

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

/* Paths */
app.use('/', index);
app.use('/api', api);
app.use('/api/bids', api_bids);
app.use('/api/products', api_products);
app.use('/api/products_in_biddings', api_products_in_biddings);
app.use('/api/enabled_products', api_enabled_products);

app.post('/refresh_products', function(req, res) {
  /* Get products from API */
  request("https://ine5646products.herokuapp.com/api/products", function(error, response, body) {
    if(error) {
      console.log("Error: ", error);
    } else { // If we we're able to load it
    
      parseJSON(body, function(error, json) {
        if(error) {
          console.log("Error: ", error);
        } else { // JSON successfully read

          /* Connect to the database */
          var db = new sqlite3.Database('athena.db', (err) => {
            if(err) {
              return console.error(err.message);
            } else {
              /* Clean table */
              db.run("DELETE FROM Products", function(error) {
                if(error) {
                  console.log(error.message);
                }
              });

              /* Register all products */
              for(i = 0; i < json.length; i++) {
                db.run("INSERT INTO Products VALUES (?, ?, ?)", json[i].id, json[i].name, json[i].enabled, function(error) {
                  if(error) {
                    console.log(error.message);
                  }
                });
              }
            }
          });
          db.close();

          res.status('202');
          res.end("Accepted.");
        }
      });
    }
  });
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
