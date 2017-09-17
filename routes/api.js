var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();

var db_file = "athena.db";
var myJSON = [];  // Used to pass the rows between functions

/* GET list of biddings */
router.get('/', function(req, res, next) {
  var db = new sqlite3.Database(db_file, (error) => {
    if(error) {
      return console.error(error.message);
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
  
  res.type("application/json");
  res.send(myJSON);
});

module.exports = router;
