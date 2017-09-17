var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('athena.db', (err) => {
  if(err) {
    return console.error(err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// db.serialize(function() {
//   db.run("CREATE TABLE lorem (info TEXT)");
// });
// db.close();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
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

module.exports = router;
