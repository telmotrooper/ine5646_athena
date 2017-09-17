var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();

router.get('/', function(req, res, next) {
  /* Connect to the database */
  var db = new sqlite3.Database('athena.db', (err) => {
    if(err) {
      return console.error(err.message);
    } else {
      db.all("SELECT * from Biddings", function(error, rows) {
        res.render('index', {
          biddings: rows, // biddings from the database
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
  db.close();
});

module.exports = router;
