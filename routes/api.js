var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();
var db_file = "athena.db";
var myJSON = [];  // Used to pass the rows between functions

router.post('/', function(req, res, next) {
  let bidding = req.body;

  if(bidding.name != "" && bidding.applicant != "" &&
     bidding.start_date != "" && bidding.end_date != "" &&
     bidding.products.length >= 1) {
       // Still gotta validate the date properly and the products

       var db = new sqlite3.Database(db_file, (error) => {
        if(error) {
          return console.error(error.message);
        } else {
          for(let i = 0; i < bidding.products.length; i++) {
            try {
              db.get(`SELECT id FROM Products WHERE name = "?"`, bidding.products[i].product_name, function(err, row) {
                if(err) {
                  console.log(err);
                } else {
                  console.log(bidding.products[i].product_name);
                  console.log(row);
                }
              });
              // console.log(temp);
              // console.log(bidding);
            } catch(error) {
              console.log("Error in product query:\n" + error);
            }
          }
        }
      });
     }

  res.send("OK");
});

/* GET biddings */
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

/* GET products from each bidding */
router.get('/', function(req, res, next) {
  var db = new sqlite3.Database(db_file, (error) => {
    if(error) {
      return console.error(error.message);
    } else {
      db.all("SELECT bidding, name AS product_name, product AS product_id, quantity FROM Biddings_Products JOIN Products ON product = id", function(error, rows) {
        if(error) {
          res.send("Error running query.");
        } else {
          /* Give each bidding it's own bids and products arrays */
          for(var i = 0; i < myJSON.length; i++) {
            myJSON[i].bids = [];
            myJSON[i].products = [];
          }

          /* Iterate through all products registed in biddings */
          for(var j = 0; j < rows.length; j++) {

            /* For each product, iterate through all biddings again */
            for(var k = 0; k < myJSON.length; k++) {
              if(myJSON[k].id == rows[j].bidding) {
                delete rows[j].bidding; // Remove 'bidding' property so it won't show up in the final response
                myJSON[k].products.push(rows[j]);
                break;
              }
            }
          }
          next(); // Run next router.get('/') function;
        }
      });
    }
  });
  db.close();
});

/* GET bids from each bidding */
router.get('/', function(req, res, next) {
  var db = new sqlite3.Database(db_file, (error) => {
    if(error) {
      return console.error(error.message);
    } else {
      db.all("SELECT * FROM Bids", function(error, rows) {
        if(error) {
          res.send("Error running query.");
        } else {
          /* Iterate through all bids registed */
          for(var i = 0; i < rows.length; i++) {
            /* For each bid, iterate through all biddings again */
            for(var j = 0; j < myJSON.length; j++) {
              if(myJSON[j].id == rows[i].bidding) {
                delete rows[j].bidding; // Remove 'bidding' property so it won't show up in the final response
                myJSON[j].bids.push(rows[i]);
                break;
              }
            }
          }
          next();
        }
      });
    }
  });
  db.close();
});

/* GET lowest bids from each bidding */
router.get('/', function(req, res, next) {
  var db = new sqlite3.Database(db_file, (error) => {
    if(error) {
      return console.error(error.message);
    } else {
      db.all("SELECT bidding, date, supplier, MIN(value) as value FROM Bids GROUP BY bidding", function(error, rows) {
        if(error) {
          res.send("Error running query.");
        } else {
          /* Iterate through all of the lowest bids */
          for(var i = 0; i < rows.length; i++) {
            /* For each lowest bid, iterate through all biddings again */
            for(var j = 0; j < myJSON.length; j++) {
              if(myJSON[j].id == rows[i].bidding) {
                delete rows[j].bidding; // Remove 'bidding' property so it won't show up in the final response
                myJSON[j].lowestBid = rows[i];
                break;
              }
            }
          }

          /* Return JSON to whoever asked */
          res.type("application/json");
          res.send(myJSON);
        }
      });
    }
  });
  db.close();
});

module.exports = router;
