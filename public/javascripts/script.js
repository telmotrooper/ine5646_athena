function change_name(name) {
	console.log("I'm working, " + name + "!");
}

$(document).ready(function() {
	$("#refresh-products").click(function() {
		$.post("/refresh_products", function() {
			/* Reload page after refreshing products */
			window.location.reload(true);
		});
	});
});
