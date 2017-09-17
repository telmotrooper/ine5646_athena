var express = require('express');
var sqlite3 = require('sqlite3').verbose();
// var asyncJSON = require('async-json');
var router = express.Router();

/* GET list of biddings */
router.get('/', function(req, res, next) {
  myJSON = [];

  var db = new sqlite3.Database('athena.db', (err) => {
    if(err) {
      return console.error(err.message);
    } else {
      db.all("SELECT * from Biddings", function(error, rows) {
        /* At this point you already have all the biddings in the 'rows' array */

        res.type("application/json");
        res.send(rows);
      });
    };
  });
  db.close();
});

module.exports = router;
