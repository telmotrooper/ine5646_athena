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
	$("#start_date").datepicker();
	$("#end_date").datepicker();

	baseProduct = $(".dropdown").clone();

	/* Refresh products button clicked */
	$("#refresh-products").click(function() {
		$.post("/refresh_products", function() {
			/* Reload page after refreshing products */
			window.location.reload(true);
		});
	});


	$(".check-bid").click(function() {
		let bidding_id = $(this).data("id");

		$("#bids-body").empty();  // Empty div

		// /* Show loading screen */
		// $("#bids-body").append(
		// 	"<center>" +
		// 		'<div class="lds-css ng-scope">' +
		// 			'<div class="lds-dual-ring">' +
		// 				"<div></div>" +
		// 			"</div>" +
		// 		"</div>" +
		// 		"<p>Carregando lances...</p>" + 
		// 	"</center>"
		// );
		
		$.getJSON("/api/bids/" + bidding_id, function(json) {
			$("#bids-body").empty();  // Empty div

			if(json.length > 0) {  // If there is at least one bidding

				/* Initialize table */
				$("#bids-body").append(
					"<table id='bids-table'>" +
						"<tr>" +
							"<td><b>Data</b></td>" +
							"<td><b>Fornecedor</b></td>" +
							"<td><b>Valor</b></td>" +
						"</tr>" +
					"</table>");
			
				/* Fill table */
				json.forEach(function(val) {
					$("#bids-table").append(
						"<tr>" +
							"<td>" + val.date + "</td>" +
							"<td>" + val.supplier + "</td>" +
							"<td>" + val.value + "</td>" +
						"</tr>"
					);
				});

			} else {
				$("#bids-body").append("<p>Nenhum lance foi feito nessa licitação.</p>");
			}
		});
	});

	$(".cancel-bidding").click(function() {
		let bidding_id = $(this).data("id");

		console.log("Attempting to cancel bidding " + bidding_id + ".");
	});

	$.getJSON("/time", function(data) {
		date = new Date(data.milliseconds);

		setInterval(function() {
			var ms = date.getTime() + 1000;
			date = new Date(ms);

			$("#time-and-date").html(calc_date_and_time(date));
		}, 1000);
	});

	/* Sending a new bidding to the server */
	$("#confirm").click(function() {
		let bidding = {
			"name": $("#name").val(),
			"applicant": $("#applicant").val(),
			"start_date": $("#start_date").val(),
			"end_date": $("#end_date").val(),
			"products": []
		}

		$("#products").children(".dropdown").each(function(key, value) {
			if($(value).children(".btn").text() != "Produto") {
				bidding.products.push(
					{
						"product_name": $(value).children(".btn").text(),
						"quantity": $(value).children("input").val()
					}
				);
			}
		});

		$.ajax({
			type: "POST",
			url: "/api",
			data: JSON.stringify(bidding),
			processData: false,
			contentType: "application/json",
			dataType:"json",
			success: function () {},
			statusCode: {
				201: function() {  // Created
					window.location.reload(true);  // Reload page
				}
			}
		});
	});
});