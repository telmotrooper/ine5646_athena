var baseProduct;
var productCounter = 1;
var date;

function change_name(product, name) {
	product = $(product);  // Wrapping DOM element in a jQuery element

	/* Finding which product it is from the anchor that called the function */
	productID = product.closest("div").children("button").prop("id");

	console.log("Changing button " + productID + " to " + name);

	$("#" + productID).text(name);
}

function calc_date_and_time(ms) {
	var date = new Date(ms);
	
	  /* Getting values */
	  var hour = date.getHours();
	  var min  = date.getMinutes();
	  var sec  = date.getSeconds();
	  var day  = date.getDate();
	  var month = date.getMonth() + 1;
	  var year = date.getFullYear();
	
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
	
	  return text = hour + ":" + min + ":" + sec + ", " + day + " de " + month + " de " + year;
}

function new_product() {
	// console.log(baseProduct.children("button").prop("id"));

	productCounter++;

	newProduct = baseProduct.clone();
	newProduct.children("button").prop("id", "product-" + productCounter);
	newProduct.prop("id", "dropdown-" + productCounter);

	$("#products").append(newProduct);
}

$(document).ready(function() {
	baseProduct = $(".dropdown").clone();

	$("#refresh-products").click(function() {
		$.post("/refresh_products", function() {
			/* Reload page after refreshing products */
			window.location.reload(true);
		});
	});

	$.getJSON("/time", function(data) {
		date = new Date(data.milliseconds);

		setInterval(function() {
			date = new Date(date.getTime() + 1000);
			$("#time-and-date").html(calc_date_and_time(date));
		}, 1000);
	});
});