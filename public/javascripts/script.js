$(document).ready(function() {
	$("#refresh-products").click(function() {
		$.post("/refresh_products");
	});
});
