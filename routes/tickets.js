var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db');

var moment = require('moment');

var prices = require('../prices.json');

var daily = [1,2,3,4];
var weekend = [5,6,0];


// define the home page route
router.get('/', function(req, res) {
  res.send('Tickets Home');
});

// define the home page route
router.get('/all', function(req, res) {
  db.all("SELECT rowid, * FROM tickets", function(err, rows) {
        res.json({'tickets': rows});
    });
});

// define the about route
router.post('/', function(req, res) {
  // res.send(req.body);
  var form = req.body;
  var startDate = moment().format();
  var total = 0;
  var daysRemaining = form.days;
  var daysArray = [];

  for(var i=0, len=form.days; i<len; i++){
    var duration = moment.duration({'days' : i});
    daysArray.push(moment(startDate).add(duration).day());
  }

  var daysArrayOG = JSON.parse(JSON.stringify(daysArray));

  while(daysRemaining > 0){
    if(daysRemaining >= 30){
      // Monthly
      total += prices.monthly;
      daysRemaining -= 30;
      daysArray.splice(0,30);
    }else if(daysRemaining >= 7){
      // Weekly
      total += prices.weekly;
      daysRemaining -= 7;
      daysArray.splice(0,7);
    }else if(daysArray[0] == 5 && daysArray[1] == 6 && daysArray[2] == 0){
      // Weekend Special
      total += prices.weekendSpecial;
      daysRemaining -= 3;
      daysArray.splice(0,3);
    }else if(isInArray(daysArray[0], daily)){
      // Daily
      total += prices.daily;
      daysRemaining -= 1;
      daysArray.splice(0,1);
    }else if(isInArray(daysArray[0], weekend)){
      total += prices.weekend;
      daysRemaining -= 1;
      daysArray.splice(0,1);
    }else{
      console.log("Woops");
    }
  };

  res.json({'daysArray':daysArrayOG, 'total': total});

  function isInArray(value, array) {
    return array.indexOf(value) > -1;
  }



  // db.run("INSERT INTO tickets (shift_id, start_date, days, end_date, total) VALUES (?,?,?,?,?,?)", [form.shift_id, startDate, form.days, form.end_date, total], function(err){
  //   console.log('Created ticket: ' + this.lastID);
  //   res.json({'lastID': this.lastID});
  // });

});

module.exports = router;
