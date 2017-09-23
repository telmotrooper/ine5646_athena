var baseProduct;
var productCounter = 1;

function change_name(product, name) {
	product = $(product);  // Wrapping DOM element in a jQuery element

	/* Finding which product it is from the anchor that called the function */
	productID = product.closest("div").children("button").prop("id");

	console.log("Changing button " + productID + " to " + name);

	$("#" + productID).text(name);
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

	$.get("/time", function(data) {
		console.log(data);
	});
});
