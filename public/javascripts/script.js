function change_name(name) {
	$("#product-1").text(name);
}

$(document).ready(function() {
	$("#refresh-products").click(function() {
		$.post("/refresh_products", function() {
			/* Reload page after refreshing products */
			window.location.reload(true);
		});
	});
});
