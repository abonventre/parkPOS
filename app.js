var express = require('express');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var exists = fs.existsSync('db.db');
var db = new sqlite3.Database('db.db');

var prices = require('./prices.json');
console.log(prices);
// Routes
var tickets = require('./routes/tickets');

var app = express();

if(!exists){
  db.serialize(function(){
    db.run("CREATE TABLE IF NOT EXISTS tickets (shift_id INTEGER, user TEXT, serial TEXT, start_date TEXT, end_date TEXT, total INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS prices (price_name TEXT PRIMARY KEY NOT NULL, price INTEGER)");
    createPrices();
    function createPrices() {
      var stmt = db.prepare("INSERT INTO prices VALUES (?, ?)");
      for (var key in prices) {
        stmt.run(key, prices[key]);
      }
      stmt.finalize();
    }
  });
}

app.get('/', function(req,res){
  res.send('test');
});

app.use('/tickets', tickets);

app.listen(3333);
console.log('Listening on 3333');
