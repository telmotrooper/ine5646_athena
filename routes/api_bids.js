const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db_file = "athena.db";

router.post('/', function(req, res, next) {
  /*  Valid request example:
      {
        "bidding": 2,
        "date": "03/11/2017",
        "supplier": "Pelé Entertainment",
        "value": 18900
      }
  */

  /* If all required fields have been filled */
  if(Number.isInteger(req.body.bidding) && req.body.date != null &&
     req.body.supplier != null && !isNaN(parseFloat(req.body.value))
     && isFinite(req.body.value)) {
      console.log(req.body);

      let db = new sqlite3.Database(db_file, (error) => {
        if(error) {
          return console.error(error.message);
        } else {
          db.run("INSERT INTO Bids VALUES (?, ?, ?, ?)",
          req.body.bidding, req.body.date, req.body.supplier, req.body.value);
        }
      });
      db.close((err) => {  // close() waits for all queries to finish
        if(err) {
          console.log(err);
        } else {  // Database connection closed
          res.status("202"); // 202 = Accepted
          res.end("Bid accepted.");
        }
      });
  } else {
    res.status("400");
    res.end("Invalid syntax.");
  }
});

/* Get data from the API */
router.get('/', function(req, res, next) {
  let myJSON = [];

  let db = new sqlite3.Database('athena.db', (err) => {
    if(err) {
      return console.error(err.message);
    } else {
      db.all("SELECT * from Bids", function(error, rows) {
        for(let i = 0; i < rows.length; i++) {
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
