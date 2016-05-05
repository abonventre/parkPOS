var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db');

var moment = require('moment');

// define the home page route
router.get('/', function(req, res) {
  res.send('Shifts Home');
});

// define the home page route
router.get('/all', function(req, res) {
  db.all("SELECT rowid, * FROM shifts", function(err, rows) {
        res.json({'shifts': rows});

    });
});

// define the about route
router.post('/', function(req, res) {
  // res.send(req.body);
  var form = req.body;
  var startDate = moment().format();
  db.run("INSERT INTO shifts (user, start_date) VALUES (?, ?)", [form.user, startDate], function(err){
    console.log('Created shift: ' + this.lastID);
    res.json({'shiftID': this.lastID, 'startDate': startDate});
  });

});

router.put('/close/:id', function(req, res){
  var endDate = moment().format();
  console.log(req.params.id);
  db.run("UPDATE shifts SET end_date = ? WHERE rowid = ?", [endDate, req.params.id], function(err){
    res.send('Updated');
  })
})

module.exports = router;
