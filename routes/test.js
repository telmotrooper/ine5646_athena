const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
	console.log(req);
	res.send("GET Received.");
});

router.post("/", function(req, res, next) {
	console.log(req);
	res.send("POST Received.");
});

module.exports = router;
