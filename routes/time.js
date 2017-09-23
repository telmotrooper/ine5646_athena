var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  
  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  
  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  
  var year = date.getFullYear();
  
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  
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

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  
  res.write(hour + ":" + min + ":" + sec + ", ");
  res.end(day + " de " + month + " de " + year + "\n");
});

module.exports = router;
