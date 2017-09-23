var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var date = new Date();

  /* Getting UTC values */
  var hour = date.getUTCHours();
  var min  = date.getUTCMinutes();
  var sec  = date.getUTCSeconds();
  var day  = date.getUTCDate();
  var month = date.getUTCMonth() + 1;
  var year = date.getUTCFullYear();

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

  var text = hour + ":" + min + ":" + sec + ", " + day + " de " + month + " de " + year + " (UTC)";

  var dateObj = {
    "milliseconds": date.getTime(),
    "text": text
  }

  // res.type()
  res.send(dateObj);
});

module.exports = router;
