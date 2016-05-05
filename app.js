var express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var exists = fs.existsSync('db.db');
var db = new sqlite3.Database('db.db');

var priceChart = require('./prices.json');

// Routes
var tickets = require('./routes/tickets');
var prices = require('./routes/prices');
var shifts = require('./routes/shifts');

var app = express();

if(!exists){
  db.serialize(function(){
    db.run("CREATE TABLE IF NOT EXISTS tickets (shift_id INTEGER, start_date TEXT, days INTEGER, end_date TEXT, total INTEGER, voided INTEGER DEFAULT 0)");
    db.run("CREATE TABLE IF NOT EXISTS shifts (user TEXT, start_date TEXT, end_date TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS holidays (date TEXT, holiday TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS prices (price_name TEXT PRIMARY KEY NOT NULL, price INTEGER)");
    createPrices();
    function createPrices() {
      var stmt = db.prepare("INSERT INTO prices VALUES (?, ?)");
      for (var key in priceChart) {
        stmt.run(key, priceChart[key]);
      }
      stmt.finalize();
    }
  });
  db.close();
}

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function(req,res){
  res.send('test');
});

app.use('/tickets', tickets);
app.use('/prices', prices);
app.use('/shifts', shifts);

app.listen(3333);
console.log('Listening on 3333');
