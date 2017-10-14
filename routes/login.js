const express = require('express');
const request = require('request');
const parseJSON = require('json-parse-async');
const router = express.Router();

/* GitHub OAuth2 stuff */
const client_id = "273dc5b8029e15a19161";
const redirect_uri = "http://localhost:8000/login";
const client_secret = "307d1a4298a32ed553ad074d79f182de39516ffc";

router.get('/', function(req, res, next) {
	if(req.query.code !== undefined) {
		console.log("Code: " + req.query.code);

		request.post({
			url: "https://github.com/login/oauth/access_token?client_id=" + client_id +
			"&redirect_uri=" + redirect_uri + "&client_secret=" + client_secret +
			"&code=" + req.query.code
		}, function(error, response, body) {
			console.log(response);
		});
	}

	res.render('login', {
		title: 'Login',
		login_required: 'Para utilizar essa aplicação, é necessário fazer login'
	});
});

module.exports = router;
