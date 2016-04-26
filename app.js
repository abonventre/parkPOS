
var express = require('express');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var exists = fs.existsSync('db.db');
var db = new sqlite3.Database('db.db');

// Routes
var tickets = require('./routes/tickets');

var app = express();

if(!exists){
  db.serialize(function(){
    db.run('CREATE TABLE tickets (shiftID integer, user varchar(255), serial varchar(255), startDate date, endDate date, total integer)');
  });
}

app.get('/', function(req,res){
  res.send('test');
});

app.use('/tickets', tickets);

app.listen(3333);
console.log('Listening on 3333');
