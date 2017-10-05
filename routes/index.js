const express = require('express');
const request = require('request');
const parseJSON = require('json-parse-async');
const router = express.Router();

router.get('/', function(req, res, next) {
	/* Get own IP */
	require('dns').lookup(require('os').hostname(), function (error, address) {
		/* Request biddings from own API */
		ownAPI = "http://" + address + ":" + req.app.get('port') + "/api";

		request(ownAPI, function(error, response, body) {
			if(error) {
				console.log("Error: ", error);
			} else {
				parseJSON(body, function(error, biddingsJSON) {  // Get JSON object from API
					/* Request enabled products form own API */
					request(ownAPI + "/enabled_products", function(error, response, body) {
						if(error) {
							console.log("Error: ", error);
						} else {
							parseJSON(body, function(error, productsJSON) {
								res.render('index', {
									biddings: biddingsJSON,  // biddings from the database
									products: productsJSON,  // enabled products from the database
									title: 'Gerenciar licitações',
									new_bidding: 'Nova licitação',
									name: 'Nome',
									applicant: 'Requerente',
									start_date: 'Data de início',
									end_date: 'Data de fim',
									products_label: 'Produtos',

									confirm: 'Confirmar',
									cancel: 'Cancelar',
									select: 'Produto',

									refreshing_products: 'Atualizando produtos',
									page_will_reload: 'A página irá recarregar dentro de alguns instantes.',

									name_placeholder: 'Exemplo: Material para restauração da ponte',
									applicant_placeholder: 'Exemplo: Prefeitura de Florianópolis',
									start_date_placeholder: 'Formato: dd/mm/aaaa',
									end_date_placeholder: 'Formato: dd/mm/aaaa'
								});
							});
						}
					});
				});
			}
		});
	});
});

module.exports = router;
