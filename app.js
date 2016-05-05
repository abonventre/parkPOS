var express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var dbExists = fs.existsSync('./data/db.db');
var db = new sqlite3.Database('./data/db.db');
var jsonfile = require('jsonfile')

var filesToInit = ['config', 'prices', 'holidays']

for (var i = 0; i < filesToInit.length; i++) {
  if(!fs.existsSync(filesToInit[i]+'.json')){
    initializeFile(filesToInit[i]);
  }
}
console.log('Files initialized.');

function initializeFile(fileName) {
  var file = './data/'+fileName+'.json';
  var init = require('./'+fileName+'.init.json');
  jsonfile.writeFileSync(file, init, {spaces: 2});
  console.log('Initialized file: '+fileName);
}

// Routes
var tickets = require('./routes/tickets');
var prices = require('./routes/prices');
var shifts = require('./routes/shifts');

var app = express();

if(!dbExists){
  db.serialize(function(){
    db.run("CREATE TABLE IF NOT EXISTS tickets (shift_id INTEGER, start_date TEXT, days INTEGER, end_date TEXT, total INTEGER, voided INTEGER DEFAULT 0)");
    db.run("CREATE TABLE IF NOT EXISTS shifts (user TEXT, start_date TEXT, end_date TEXT)");
  });
  console.log("DB Initialized");
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
