var express = require('express');
var router = express.Router();

var moment = require('moment');

var colors = require('colors');

var ticketPrinter = require('../helpers/printer')();

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
    var endDate = moment().format(),
        shift = req.body.shift,
        deposit = req.body.deposit;
    db.run("UPDATE shifts SET end_date = ?, deposit = ? WHERE rowid = ?", [endDate, deposit, req.params.id], function(err){
      db.all("SELECT * FROM tickets WHERE shift_id = ?", [req.params.id], function(err, rows){
        shift.endDate = endDate;
        if(rows.length > 0){
          var ticketTotal = 0;
          var breakdown = {};
          for (var i = 0; i < rows.length; i++) {
            if(!rows[i].voided){
              if(!breakdown[rows[i].days]){
                breakdown[rows[i].days] = 0;
              }
              breakdown[rows[i].days] += rows[i].total;
              ticketTotal += rows[i].total;
            }
          }
          db.all("SELECT * FROM drops WHERE shift_id = ?", [req.params.id], function(err, dropRows){
            var dropTotal = 0;
            for (var i = 0; i < dropRows.length; i++) {
              dropTotal += dropRows[i].amount;
            }
            ticketPrinter.printCloseOut(config.lot, shift, breakdown, ticketTotal, dropRows, dropTotal, deposit);
            res.json({tickets: rows, breakdown: breakdown, });
          });

        }else{
          res.json({'status':'No tickets printed.'});
        }

      });

    })
  })

  return router;
};
