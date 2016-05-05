var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db');

// define the index route
router.get('/', function(req, res) {
  db.all("SELECT price_name, price FROM prices", function(err, rows) {
      var prices = {};
        rows.forEach(function (row) {
            prices[row.price_name] = row.price;
        });

        res.json({'prices': prices});
    });
});

module.exports = router;
