const express = require('express');
const request = require('request');
const parseJSON = require('json-parse-async');
const router = express.Router();

router.get('/', function(req, res, next) {
	res.render('login', {
		title: 'Login',
		login_required: 'Para utilizar essa aplicação, é necessário fazer login'
	});
});

module.exports = router;
