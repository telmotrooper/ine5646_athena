const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	let date = new Date();

	/* Getting UTC values */
	let hour = date.getUTCHours();
	let min  = date.getUTCMinutes();
	let sec  = date.getUTCSeconds();
	let day  = date.getUTCDate();
	let month = date.getUTCMonth() + 1;
	let year = date.getUTCFullYear();

	/* Putting the zeroes when required */
	hour = (hour < 10 ? "0" : "") + hour;
	min = (min < 10 ? "0" : "") + min;
	sec = (sec < 10 ? "0" : "") + sec;
	day = (day < 10 ? "0" : "") + day;
	month = (month < 10 ? "0" : "") + month;
  
	/* Writing the months in full */
	switch(month) {
		case "01":
			month = "janeiro";
			break;
		case "02":
			month = "fevereiro";
			break;
		case "03":
			month = "março";
			break;
		case "04":
			month = "abril";
			break;
		case "05":
			month = "maio";
			break;
		case "06":
			month = "junho";
			break;
		case "07":
			month = "julho";
			break;
		case "08":
			month = "agosto";
			break;
		case "09":
			month = "setembro";
			break;
		case "10":
			month = "outubro";
			break;
		case "11":
			month = "novembro";
			break;
		case "12":
			month = "dezembro";
	}

	let text = hour + ":" + min + ":" + sec + ", " + day + " de " + month + " de " + year + " (UTC)";

	let dateObj = {
		"milliseconds": date.getTime(),
		"text": text
	}

	res.send(dateObj);
});

module.exports = router;
