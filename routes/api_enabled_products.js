var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();

/* Get products from the API */
router.get('/', function(req, res, next) {
  myJSON = [];

  var db = new sqlite3.Database('athena.db', (err) => {
    if(err) {
      return console.error(err.message);
    } else {
      db.all("SELECT * FROM Products WHERE status = '1'", function(error, rows) {
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