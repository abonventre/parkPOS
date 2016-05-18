var express = require('express');
var router = express.Router();

var moment = require('moment');

var colors = require('colors');

var ticketPrinter = require('../helpers/printer')();

module.exports = function(db, config){
  // define the home page route
  router.get('/', function(req, res) {
    res.send('Drops Home');
  });

  // define the home page route
  router.get('/all', function(req, res) {
    db.all("SELECT rowid, * FROM drops", function(err, rows) {
      if(err){
        return res.status(500).json({'message':'There was an error getting the drops.'});
      }
          res.status(200).json({'drops': rows});
      });
  });

  // Make a drop
  router.post('/', function(req, res) {
    // res.send(req.body);
    var form = req.body;
    if(!form.amount){
      return res.status(400).json({'message': 'Deposit amount cannot be left blank or be zero dollars.'});
    }

    if(!form.name){
      return res.status(400).json({'message': 'Name cannot be left blank.'});
    }
    var timestamp = moment().format();
    db.run("INSERT INTO drops (shift_id, timestamp, name, amount) VALUES (?, ?, ?, ?)", [form.shiftID, timestamp, form.name, form.amount], function(err){
      if(err){
        return res.status(500).json({'message':'There was an error making the drop.'});
      }
      console.log(' ===DROP====================================='.gray);
      console.log(' ='.gray+' **Created**: '.blue);
      console.log(' ='.gray+' Timestamp: '.blue+timestamp);
      console.log(' ='.gray+' Name: '.blue+form.name);
      console.log(' ='.gray+' Amount: '.blue+form.amount);
      console.log(' ============================================'.gray);
      ticketPrinter.printDrop(config.lot, timestamp, form.shift, form.name, form.amount);
      res.status(200).json({'drop':form.amount});
    });

  });

  return router;
};
