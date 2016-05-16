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
      if(err){
        res.status(500).json({'message':'There was an error getting all the shifts.'});
      }
          res.status(200).json({'shifts': rows});
      });
  });

  // define the about route
  router.post('/', function(req, res) {
    // res.send(req.body);
    var form = req.body;
    var startDate = moment().format();
    var user = req.body.firstName + ' ' + req.body.lastName;
    db.run("INSERT INTO shifts (user, start_date) VALUES (?, ?)", [user, startDate], function(err){
      if(err){
        res.status(500).json({'message':'Could not insert shift into database.'});
      }
      console.log(' ===SHIFT===================================='.gray);
      console.log(' ='.gray+' **Started**: '.blue);
      console.log(' ='.gray+' Start Date: '.blue+startDate);
      console.log(' ='.gray+' User: '.blue+user);
      console.log(' ============================================'.gray);
      res.json({'shiftID': this.lastID, 'startDate': startDate, 'user': user});
    });

  });

  router.put('/close/:id', function(req, res){
    var endDate = moment().format(),
        shift = req.body.shift,
        deposit = req.body.deposit;
    db.run("UPDATE shifts SET end_date = ?, deposit = ? WHERE rowid = ?", [endDate, deposit, req.params.id], function(err){
      if(err){
        res.status(500).json({'message':'There was an error updating the shift.'});
      }
      db.all("SELECT * FROM tickets WHERE shift_id = ?", [req.params.id], function(err, rows){
        if(err){
          res.status(500).json({'message':'There was an error finding tickets.'});
        }
        shift.endDate = endDate;
        if(rows.length > 0){
          var ticketTotal = 0;
          var breakdown = {};
          for (var i = 0; i < tickets.length; i++) {
            if(!tickets[i].voided){
              if(!breakdown[tickets[i].days]){
                breakdown[tickets[i].days] = {'qty':0,'total':0};
              }
              breakdown[tickets[i].days].qty++;
              breakdown[tickets[i].days].total += tickets[i].total;
              ticketTotal += tickets[i].total;
            }
          }
          db.all("SELECT * FROM drops WHERE shift_id = ?", [req.params.id], function(err, dropRows){
            if(err){
              res.status(500).json({'message':'There was an error getting the drops.'});
            }
            var dropTotal = 0;
            for (var i = 0; i < dropRows.length; i++) {
              dropTotal += dropRows[i].amount;
            }
            console.log(' ===SHIFT===================================='.gray);
            console.log(' ='.gray+' **Ended**: '.blue);
            console.log(' ='.gray+' Start Date: '.blue+shift.startDate);
            console.log(' ='.gray+' End Date: '.blue+endDate);
            console.log(' ='.gray+' User: '.blue+shift.user);
            console.log(' ='.gray+' Sold: '.blue+ticketTotal);
            console.log(' ='.gray+' Drops Total: '.blue+dropTotal);
            console.log(' ='.gray+' Final Deposit: '.blue+deposit);
            console.log(' ='.gray+' Over/Under: '.blue+((dropTotal+deposit)-ticketTotal));
            console.log(' ============================================'.gray);
            ticketPrinter.printCloseOut(config.lot, shift, breakdown, ticketTotal, dropRows, dropTotal, deposit);
            res.status(200).json({'message':'Shift report printed.','tickets': rows, 'breakdown': breakdown});
          });

        }else{
          ticketPrinter.printCloseOut(config.lot, shift, {}, 0, [], 0, 0);
          res.status(200).json({'message':'Shift report printed for zero total.'});
        }

      });

    })
  })

  router.get('/last', function(req, res){
    console.log("Print Last Report");
    db.all("SELECT rowid, * FROM shifts WHERE end_date IS NOT NULL ORDER BY rowid DESC LIMIT 1", function(err, rows){
      if(err){
        res.status(500).json({'message':'There was an error getting the last shift.'});
      }
      console.log(rows.length);
      if(rows.length == 0){
        res.status(400).json({'message':'No last shift was found.'});
      }else{
        var shift = rows[0];
        shift.shiftID = shift.rowid;
        db.all("SELECT * FROM tickets WHERE shift_id = ?", [shift.rowid], function(err, tickets){
          if(err){
            res.status(500).json({'message':'There was an error getting the shifts tickets.'});
          }
          if(tickets.length > 0){
            var ticketTotal = 0;
            var breakdown = {};
            for (var i = 0; i < tickets.length; i++) {
              if(!tickets[i].voided){
                if(!breakdown[tickets[i].days]){
                  breakdown[tickets[i].days] = {'qty':0,'total':0};
                }
                breakdown[tickets[i].days].qty++;
                breakdown[tickets[i].days].total += tickets[i].total;
                ticketTotal += tickets[i].total;
              }
            }
            db.all("SELECT * FROM drops WHERE shift_id = ?", [shift.rowid], function(err, drops){
              if(err){
                res.status(500).json({'message':'There was an error getting the shifts drops.'});
              }
              var dropTotal = 0;
              for (var i = 0; i < drops.length; i++) {
                dropTotal += drops[i].amount;
              }
              console.log(' ===SHIFT===================================='.gray);
              console.log(' ='.gray+' **Ended**: '.blue);
              console.log(' ='.gray+' Start Date: '.blue+shift.start_date);
              console.log(' ='.gray+' End Date: '.blue+shift.end_date);
              console.log(' ='.gray+' User: '.blue+shift.user);
              console.log(' ='.gray+' Sold: '.blue+ticketTotal);
              console.log(' ='.gray+' Drops Total: '.blue+dropTotal);
              console.log(' ='.gray+' Final Deposit: '.blue+shift.deposit);
              console.log(' ='.gray+' Over/Under: '.blue+((dropTotal+shift.deposit)-ticketTotal));
              console.log(' ============================================'.gray);
              ticketPrinter.printCloseOut(config.lot, shift, breakdown, ticketTotal, drops, dropTotal, shift.deposit);
              res.json({tickets: tickets, breakdown: breakdown, });
            });
          }else{
            console.log("No tickets found.");
            ticketPrinter.printCloseOut(config.lot, shift, {}, 0, [], 0, 0);
            res.status(200).json({'message':'Shift report printed for zero total.'});
          }
        });
      }
    });
  });


  return router;
};
