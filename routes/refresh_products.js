const express = require('express');
const parseJSON = require('json-parse-async');
const request = require('request');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

router.post('/', function(req, res) {
	/* Get products from API */
	request("https://ine5646products.herokuapp.com/api/products", function(error, response, body) {
		if(error) {
			console.log("Error: ", error);
		} else { // If we we're able to load it

			parseJSON(body, function(error, json) {
				if(error) {
					console.log("Error: ", error);
				} else { // JSON successfully read

					/* Connect to the database */
					const db = new sqlite3.Database('athena.db', (err) => {
						if(err) {
							return console.error(err.message);
						} else {
							/* Clean table */
							db.run("DELETE FROM Products", function(error) {
								if(error) {
									console.log(error.message);
								}
							});

							/* Register all products */
							for(let i = 0; i < json.length; i++) {
								db.run("INSERT INTO Products VALUES (?, ?, ?)", json[i].id, json[i].name, json[i].enabled, function(error) {
									if(error) {
										console.log(error.message);
									}
								});
							}
						}
					});
					db.close((err) => {  // close() waits for all queries to finish
						if(err) {
						  console.log(err);
						} else {  // Database connection closed
							res.status("202");
							res.end("Accepted.");
						}
					});
				}
			});
		}
	});
});

module.exports = router;
