'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    appPath = path.resolve(),
    sqlite3 = require('sqlite3').verbose(),
    dbExists = fs.existsSync(appPath+'/data/db.db'),
    db = new sqlite3.Database(appPath+'/data/db.db'),
    jsonfile = require('jsonfile');

console.log(appPath);

var filesToInit = ['config', 'prices', 'holidays'];

for (var i = 0; i < filesToInit.length; i++) {
  // Check if files exist to begin with
  if(!fs.existsSync(appPath+'/data/'+filesToInit[i]+'.json')){
    initializeFile(filesToInit[i]);
  }
}
console.log('Files initialized.');

var prices = require(appPath+'/data/prices.json');
var config = require(appPath+'/data/config.json');

function initializeFile(fileName) {
  // File name to create
  var file = appPath+'/data/'+fileName+'.json';

  //Init File
  var init = require(appPath+'/'+fileName+'.init.json');

  // Blocking write new file
  jsonfile.writeFileSync(file, init, {spaces: 2});
  console.log('Initialized file: '+fileName);
}

// Routes
var tickets = require(appPath+'/routes/tickets')(db, prices, config);
var prices = require(appPath+'/routes/prices')(prices, config);
var shifts = require(appPath+'/routes/shifts')(db, config);
var drops = require(appPath+'/routes/drops')(db, config);

var app = express();

if(!dbExists){
  db.serialize(function(){
    db.run("CREATE TABLE IF NOT EXISTS tickets (shift_id INTEGER, start_date TEXT, days INTEGER, end_date TEXT, total INTEGER, voided INTEGER DEFAULT 0, failed INTEGER DEFAULT 0)");
    db.run("CREATE TABLE IF NOT EXISTS shifts (user TEXT, start_date TEXT, end_date TEXT, deposit INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS drops (shift_id INTEGER, timestamp TEXT, name TEXT, amount INTEGER)");
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
app.use('/drops', drops);

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
