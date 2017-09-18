var express = require('express');
var request = require('request');
var parseJSON = require('json-parse-async');
var router = express.Router();

router.get('/', function(req, res, next) {
  request("https://athena-ine5646.herokuapp.com/api", function(error, response, body) {
    if(error) {
      console.log("Error: ", error);
    } else {
      parseJSON(body, function(error, content) {  // Get JSON object from API
        res.render('index', {
          biddings: content, // biddings from the database
          title: 'Gerenciar licitações',
          new_bidding: 'Nova licitação',
          name: 'Nome',
          applicant: 'Requerente',
          start_date: 'Data de início',
          end_date: 'Data de fim',
          products: 'Produtos',
        
          confirm: 'Confirmar',
          cancel: 'Cancelar',
        
          name_placeholder: 'Exemplo: Material para restauração da ponte',
          applicant_placeholder: 'Exemplo: Prefeitura de Florianópolis',
          start_date_placeholder: 'Formato: dd/mm/aaaa',
          end_date_placeholder: 'Formato: dd/mm/aaaa'
        });
      });
    }
  });
});

module.exports = router;
