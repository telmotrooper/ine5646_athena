var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();
var myJSON = [];  // Used to pass the rows between functions

/* GET list of biddings */
router.get('/', function(req, res, next) {
  var db = new sqlite3.Database('athena.db', (err) => {
    if(err) {
      return console.error(err.message);
    } else {
      db.all("SELECT * from Biddings", function(error, rows) {
        if(error) {
          res.send("Error running query.");
        } else {
          /* At this point you already have all the biddings in the 'rows' array */

          myJSON = rows;

          next(); // Run next router.get('/') function;
        }
      });
    };
  });
  db.close();
});

router.get('/', function(req, res, next) {
  // res.send("Hey, I'm working!");
  res.type("application/json");
  res.send(myJSON);
});

module.exports = router;
