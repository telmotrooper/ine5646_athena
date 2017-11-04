const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();

const db_file = "athena.db";

router.post("/:bidding", function(req, res, next) {
  let bidding_id = parseInt(req.params.bidding);

  console.log(bidding_id);

  if(!isNaN(bidding_id)) {
    res.end("DONE");
  } else {
    res.status("400");
    res.end("Bad request");
  }
});

module.exports = router;
