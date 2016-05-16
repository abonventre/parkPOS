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
          res.json({'drops': rows});
      });
  });

  // define the about route
  router.post('/', function(req, res) {
    // res.send(req.body);
    var form = req.body;
    var timestamp = moment().format();
    db.run("INSERT INTO drops (shift_id, timestamp, name, amount) VALUES (?, ?, ?, ?)", [form.shiftID, timestamp, form.name, form.amount], function(err){
      console.log(' ===DROP====================================='.gray);
      console.log(' ='.gray+' **Created**: '.blue);
      console.log(' ='.gray+' Timestamp: '.blue+timestamp);
      console.log(' ='.gray+' Name: '.blue+form.name);
      console.log(' ='.gray+' Amount: '.blue+form.amount);
      console.log(' ============================================'.gray);
      ticketPrinter.printDrop(timestamp, form.shift, form.name, form.amount);
      res.json({'drop':form.amount});
    });

  });

  return router;
};
