const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const db_file = "athena.db";

router.post('/', function(req, res, next) {
  let bidding = req.body;

  if(bidding.name != "" && bidding.applicant != "" &&
     bidding.start_date != "" && bidding.end_date != "" &&
     bidding.products.length >= 1) {
       // Still gotta validate the date properly and the products

       let db = new sqlite3.Database(db_file, (error) => {
        if(error) {
          return console.error(error.message);
        } else {
          for(let i = 0; i < bidding.products.length; i++) {
            let query = 'SELECT id FROM Products WHERE name = "' + bidding.products[i].product_name + '"';
            try {
              db.get(query, function(err, row) {
                if(err) {
                  console.log(err);
                } else {
                  /* Add product IDs to the JSON object */
                  bidding.products[i].id = row.id;
                }
              });
              
            } catch(error) {
              console.log(error);
            }
          }
        }
      });
      db.close((err) => {  // close() waits for all queries to finish
        if(err) {
          console.log(err);
        } else {  // Database connection closed

          /* Passing bidding to the next method */
          req.myJSON = bidding;
          next();
        }
      });
     }

  res.send("OK");
});

router.post('/', function(req, res, next) {

  console.log(req.myJSON);
});

/* GET biddings */
router.get('/', function(req, res, next) {
  let db = new sqlite3.Database(db_file, (error) => {
    if(error) {
      return console.error(error.message);
    } else {
      db.all("SELECT * from Biddings", function(error, rows) {
        if(error) {
          res.send("Error running query.");
        } else {
          /* At this point you already have all the biddings in the 'rows' array */
          req.myJSON = rows;
          next(); // Run next router.get('/') function;
        }
      });
    };
  });
  db.close();
});

/* GET products from each bidding */
router.get('/', function(req, res, next) {
  let db = new sqlite3.Database(db_file, (error) => {
    if(error) {
      return console.error(error.message);
    } else {
      db.all("SELECT bidding, name AS product_name, product AS product_id, quantity FROM Biddings_Products JOIN Products ON product = id", function(error, rows) {
        if(error) {
          res.send("Error running query.");
        } else {
          /* Give each bidding it's own bids and products arrays */
          for(let i = 0; i < req.myJSON.length; i++) {
            req.myJSON[i].bids = [];
            req.myJSON[i].products = [];
          }

          /* Iterate through all products registed in biddings */
          for(let j = 0; j < rows.length; j++) {

            /* For each product, iterate through all biddings again */
            for(let k = 0; k < req.myJSON.length; k++) {
              if(req.myJSON[k].id == rows[j].bidding) {
                delete rows[j].bidding; // Remove 'bidding' property so it won't show up in the final response
                req.myJSON[k].products.push(rows[j]);
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
  let db = new sqlite3.Database(db_file, (error) => {
    if(error) {
      return console.error(error.message);
    } else {
      db.all("SELECT * FROM Bids", function(error, rows) {
        if(error) {
          res.send("Error running query.");
        } else {
          /* Iterate through all bids registed */
          for(let i = 0; i < rows.length; i++) {
            /* For each bid, iterate through all biddings again */
            for(let j = 0; j < req.myJSON.length; j++) {
              if(req.myJSON[j].id == rows[i].bidding) {
                delete rows[j].bidding; // Remove 'bidding' property so it won't show up in the final response
                req.myJSON[j].bids.push(rows[i]);
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
  let db = new sqlite3.Database(db_file, (error) => {
    if(error) {
      return console.error(error.message);
    } else {
      db.all("SELECT bidding, date, supplier, MIN(value) as value FROM Bids GROUP BY bidding", function(error, rows) {
        if(error) {
          res.send("Error running query.");
        } else {
          /* Iterate through all of the lowest bids */
          for(let i = 0; i < rows.length; i++) {
            /* For each lowest bid, iterate through all biddings again */
            for(let j = 0; j < req.myJSON.length; j++) {
              if(req.myJSON[j].id == rows[i].bidding) {
                delete rows[j].bidding; // Remove 'bidding' property so it won't show up in the final response
                req.myJSON[j].lowestBid = rows[i];
                break;
              }
            }
          }

          /* Return JSON to whoever asked */
          res.type("application/json");
          res.send(req.myJSON);
        }
      });
    }
  });
  db.close();
});

module.exports = router;
