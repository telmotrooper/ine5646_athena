var baseProduct;
var productCounter = 1;
var date;

function change_name(product, name) {
	product = $(product);  // Wrapping DOM element in a jQuery element

	/* Finding which product it is from the anchor that called the function */
	productID = product.closest("div").children("button").prop("id");

	$("#" + productID).text(name);
}

function calc_date_and_time(ms) {
	var date = new Date(ms);

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
	
	return text = hour + ":" + min + ":" + sec + ", " + day + "/" + month + "/" + year + " (UTC)";
}

function new_product() {
	productCounter++;

	newProduct = baseProduct.clone();
	newProduct.children("button").prop("id", "product-" + productCounter);
	newProduct.prop("id", "dropdown-" + productCounter);

	$("#products").append(newProduct);
}

$(document).ready(function() {
	$("#start_date").datepicker({dateFormat: "dd/mm/yy"});
	$("#end_date").datepicker({dateFormat: "dd/mm/yy"});

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
			var ms = date.getTime() + 1000;
			date = new Date(ms);

			$("#time-and-date").html(calc_date_and_time(date));
		}, 1000);
	});

	$("#confirm").click(function() {
		let bidding = {
			"name": $("#name").val(),
			"applicant": $("#applicant").val(),
			"start_date": $("#start_date").val(),
			"end_date": $("#end_date").val(),
			"products": []
		}

		$("#products").children(".dropdown").each(function(key, value) {
			bidding.products.push(
				{
					"product_name": $(value).children(".btn").text(),
					"quantity": $(value).children("input").val()
				}
			);
		});

		console.log("I'm posting this: ");
		console.log(bidding);

		$.post("/api", bidding);
	});
});