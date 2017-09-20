var baseProduct;
var productCounter = 1;

function change_name(product, name) {
	product = $(product);  // Wrapping DOM element in a jQuery element

	console.log(product.closest("div").children("button").prop("id"));

	// $(product.id).text(name);
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

	new_product();
	new_product();

	$("#refresh-products").click(function() {
		$.post("/refresh_products", function() {
			/* Reload page after refreshing products */
			window.location.reload(true);
		});
	});
});
