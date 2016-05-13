'use strict';

var express = require('express');
var router = express.Router();

var moment = require('moment');

var colors = require('colors');

var ticketPrinter = require('../helpers/printer')();

module.exports = function(db, prices, config){
  var priceCalculator = require('../helpers/priceCalculator')(prices, config);

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
    console.log(req.body);

    // res.send(req.body);
    var form = req.body,
        startDate = moment().format(),
        total = 0,
        numTickets = req.body.amount,
        printedTickets = [];

    if(!form.days){
      return res.json({'error': 'Missing amount of days.'});
    }
    if(!form.endDate) {
      var duration = moment.duration({'days' : form.days-1});
      form.endDate = moment(startDate).startOf('day').add(duration).format();
    }
    if(!form.shift_id){
      return res.json({'error': 'Missing shift ID.'});
    }

    total = priceCalculator.days(form.days);

    for (var i = 0; i < numTickets; i++) {
      ticketPrinter.printTicket(startDate, form.endDate, form.days, total, "TESTTICKET", config.disclaimer);

      db.run("INSERT INTO tickets (shift_id, start_date, days, end_date, total) VALUES (?,?,?,?,?)", [form.shift_id, startDate, form.days, form.endDate, total], function(err){
        console.log('Created ticket: '.blue + this.lastID);
        if(err){
          console.error(err);
          res.json({'error': 'Was not able to insert ticket to db.'});
        };
        printedTickets.push(this.lastID);
      });
    }

    console.log('===TICKET==================================='.gray);
    console.log('='.gray+' Start Date: '.blue+startDate);
    console.log('='.gray+' End Date: '.blue+form.endDate);
    console.log('='.gray+' Days: '.blue+form.days);
    console.log('='.gray+' Total: '.blue+'$'+total);
    console.log('============================================'.gray);

    res.json({'tickets': printedTickets, 'total':total});
  });

  return router;
};
