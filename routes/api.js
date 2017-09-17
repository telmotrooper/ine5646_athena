var express = require('express');
var sqlite3 = require('sqlite3').verbose();
// var asyncJSON = require('async-json');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  myJSON = [];

  var db = new sqlite3.Database('athena.db', (err) => {
    if(err) {
      return console.error(err.message);
    } else {
      db.all("SELECT * from Biddings", function(error, rows) {
        for(var i = 0; i < rows.length; i++) {
          myJSON.push(rows[i]);
        };

        res.type("application/json");
        res.send(myJSON);
      });
    };
  });
  db.close();
});

module.exports = router;
