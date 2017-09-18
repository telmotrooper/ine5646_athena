var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();

var db_file = "athena.db";

router.post('/', function(req, res, next) {
  /* If all required fields have been filled */
  if(Number.isInteger(req.body.bidding) && req.body.date != null &&
     req.body.supplier != null && !isNaN(parseFloat(req.body.value))
     && isFinite(req.body.value)) {
      console.log(req.body);

      var db = new sqlite3.Database(db_file, (error) => {
        if(error) {
          return console.error(error.message);
        } else {
          db.run("INSERT INTO Bids VALUES (?, ?, ?, ?)",
          req.body.bidding, req.body.date, req.body.supplier, req.body.value);
        }
      });
      db.close();

      res.status("202"); // 202 = Accepted
      res.end("Bid accepted.");
  } else {
    res.status("400");
    res.end("Invalid syntax.");
  }
});

/* Get data from the API */
router.get('/', function(req, res, next) {
  myJSON = [];

  var db = new sqlite3.Database('athena.db', (err) => {
    if(err) {
      return console.error(err.message);
    } else {
      db.all("SELECT * from Bids", function(error, rows) {
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
