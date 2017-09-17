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
  var db = new sqlite3.Database(db_file, (error) => {
    if(error) {
      return console.error(error.message);
    } else {
      db.all("SELECT bidding, name AS product_name, product AS product_id, quantity FROM Biddings_Products JOIN Products ON product = id", function(error, rows) {
        if(error) {
          res.send("Error running query.");
        } else {
          /* Give each bidding it's own products array */
          for(var i = 0; i < myJSON.length; i++) {
            myJSON[i].products = [];
          }

          /* Iterate through all products in biddings */
          for(var j = 0; j < rows.length; j++) {

            /* For each product, iterate through all biddings again */
            for(var k = 0; k < myJSON.length; k++) {
              if(myJSON[k].id == rows[j].bidding) {
                myJSON[k].products.push(rows[j]);
                break;
              }
            }
          }

          console.log("--- Biddings ---");
          console.log(myJSON);

          console.log("--- Products ---");
          console.log(rows);

          res.type("application/json");
          res.send(myJSON);
        }
      });
    }
  });
});

module.exports = router;
