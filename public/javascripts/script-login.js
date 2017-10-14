$(document).ready(function() {
	// jQuery stuff here
	$("#github-login").click(function() {
		window.location.replace(
			"https://github.com/login/oauth/authorize?client_id=273dc5b8029e15a19161&redirect_uri=" + 
			"http://localhost:8000/login"
		);
	});
});
