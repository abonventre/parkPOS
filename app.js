'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    sqlite3 = require('sqlite3').verbose(),
    dbExists = fs.existsSync('./data/db.db'),
    db = new sqlite3.Database('./data/db.db'),
    jsonfile = require('jsonfile');

var filesToInit = ['config', 'prices', 'holidays'];

for (var i = 0; i < filesToInit.length; i++) {
  // Check if files exist to begin with
  if(!fs.existsSync('./data/'+filesToInit[i]+'.json')){
    initializeFile(filesToInit[i]);
  }
}
console.log('Files initialized.');

var prices = require('./data/prices.json');
var config = require('./data/config.json');

function initializeFile(fileName) {
  // File name to create
  var file = './data/'+fileName+'.json';

  //Init File
  var init = require('./'+fileName+'.init.json');

  // Blocking write new file
  jsonfile.writeFileSync(file, init, {spaces: 2});
  console.log('Initialized file: '+fileName);
}

// Routes
var tickets = require('./routes/tickets')(db, prices, config);
var prices = require('./routes/prices')(prices, config);
var shifts = require('./routes/shifts')(db, config);

var app = express();

if(!dbExists){
  db.serialize(function(){
    db.run("CREATE TABLE IF NOT EXISTS tickets (shift_id INTEGER, start_date TEXT, days INTEGER, end_date TEXT, total INTEGER, voided INTEGER DEFAULT 0, failed INTEGER DEFAULT 0)");
    db.run("CREATE TABLE IF NOT EXISTS shifts (user TEXT, start_date TEXT, end_date TEXT)");
  });
  console.log("DB Initialized");
  db.close();
}

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var options = {
    root: __dirname + '/client/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

// app.get('/', function(req,res){
//   res.send('test');
// });

app.use(express.static(__dirname + '/client'));

app.use('/tickets', tickets);
app.use('/prices', prices);
app.use('/shifts', shifts);

app.get('*', function(req, res) {
        res.sendFile('index.html', options, function(err){
          if (err) {
            console.log(err);
            res.status(err.status).end();
          }
        }); // load the single view file (angular will handle the page changes on the front-end)
    });

app.listen(3333);
console.log('Listening on 3333');
