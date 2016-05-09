var express = require('express');
var router = express.Router();

var moment = require('moment');

module.exports = function(db, config){
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
    var user = req.body.firstName + ' ' + req.body.lastName;
    db.run("INSERT INTO shifts (user, start_date) VALUES (?, ?)", [user, startDate], function(err){
      console.log('Created shift: ' + this.lastID);
      res.json({'shiftID': this.lastID, 'startDate': startDate, 'user': user});
    });

  });

  router.put('/close/:id', function(req, res){
    var endDate = moment().format();
    console.log(req.params.id);
    db.run("UPDATE shifts SET end_date = ?, deposit = ? WHERE rowid = ?", [endDate, req.body.deposit, req.params.id], function(err){
      db.all("SELECT * FROM tickets WHERE shift_id = ?", [req.params.id], function(err, rows){
        res.json({tickets: rows});
      });

    })
  })

  return router;
};
