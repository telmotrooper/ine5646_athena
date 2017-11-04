const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();

const db_file = "athena.db";

/* Part 1/3: Validating parameter types */
router.post("/:bidding/:status", function(req, res, next) {
  let bidding_id = parseInt(req.params.bidding);
  let status = parseInt(req.params.status);

  if(!isNaN(bidding_id) && !isNaN(status)) {
    next();

  } else {
    res.status("400");
    res.end("Bad request");
  }
});

/* Part 2/3: Validating id */
router.post("/:bidding/:status", function(req, res, next) {
  let bidding_id = parseInt(req.params.bidding);
  
  let db = new sqlite3.Database(db_file, (err) => {
    if(err) {
      return console.error(err.message);
    } else {
      db.all("SELECT * from Biddings WHERE id='" + bidding_id + "'", function(error, rows) {
        try {
          if(rows.length >= 1) {
            next();
          } else{
            res.status("400");
            res.end("Bad request");
          }
        } catch(err) {
          console.log(err);
          res.status("500");
          res.end("Internal server error");
        }
      });
    };
  });
  db.close();
});

/* Part 3/3: Changing bidding status */
router.post("/:bidding/:status", function(req, res, next) {
  let bidding_id = parseInt(req.params.bidding);
  let status = parseInt(req.params.status);

  let db = new sqlite3.Database(db_file, (err) => {
    if(err) {
      return console.error(err.message);
    } else {
      db.run("UPDATE Biddings SET status = " + status + " WHERE id = " + bidding_id, function(error) {
        if(error) {
          console.log(error);
          res.status("500");
          res.end("Internal server error");
        } else {
          res.status("200");
          res.end("OK");
        }
      });
    };
  });
  db.close();
});

module.exports = router;
