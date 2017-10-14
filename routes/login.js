const express = require('express');
const request = require('request');
const parseJSON = require('json-parse-async');
const router = express.Router();

/* GitHub OAuth2 stuff */
const client_id = "273dc5b8029e15a19161";
const redirect_uri = "http://localhost:8000/login";
const client_secret = "307d1a4298a32ed553ad074d79f182de39516ffc";

router.get('/', function(req, res, next) {
	if(req.query.code !== undefined) {  // If a code was received
		/* Request access token */
		request.post({
			url: "https://github.com/login/oauth/access_token?client_id=" + client_id +
			"&redirect_uri=" + redirect_uri + "&client_secret=" + client_secret +
			"&code=" + req.query.code,
			headers: {
				'Accept': "application/json"
			}
		}, function(error, response, body) {
			/* Parse response string as a JSON object */
			parseJSON(body, function(error, content) {
				/* Expect either "access_token" or "error" */

				if(content.access_token !== undefined) { // If an access token has been received
					/* Request the user data from the GitHub API */
					request("https://api.github.com/user?access_token=" + content.access_token,
					{headers: { "User-Agent": "Athena" }}, function(error, response, body) {
						parseJSON(body, function(error, content) {
							console.log(content);
						});
					});
				}
			});
		});
	}

	res.render('login', {
		title: 'Login',
		login_required: 'Para utilizar essa aplicação, é necessário fazer login'
	});
});

module.exports = router;
