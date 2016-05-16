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
      if(err){
        res.status(500).json({'message':'There was an error getting all the tickets.'});
      }
          res.json({'tickets': rows});
      });
  });

  // define the about route
  router.post('/', function(req, res) {
    console.log("PrintTicket Route");
    console.log(req.body);
    // res.send(req.body);
    var form = req.body,
        startDate = moment().format(),
        total = 0,
        numTickets = req.body.amount,
        printedTickets = [];

    console.log("Checking form data...");
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
    console.log("Calculating price...");
    total = priceCalculator.days(form.days);
    console.log("Calulated Price:" + total.toString());
    for (var i = 0; i < numTickets; i++) {
      console.log("Print?");

      db.run("INSERT INTO tickets (shift_id, start_date, days, end_date, total) VALUES (?,?,?,?,?)", [form.shift_id, startDate, form.days, form.endDate, total], function(err){

        console.log('Created ticket: '.blue + this.lastID);
        if(err){
          console.error(err);
          res.status(500).json({'message': 'Was not able to insert ticket to db.'});
        };
        ticketPrinter.printTicket(startDate, form.endDate, form.days, total, "TESTTICKET", config.disclaimer);

        printedTickets.push(this.lastID);
      });
    }

    console.log(' ===TICKET==================================='.gray);
    console.log(' ='.gray+' Start Date: '.blue+startDate);
    console.log(' ='.gray+' End Date: '.blue+form.endDate);
    console.log(' ='.gray+' Days: '.blue+form.days);
    console.log(' ='.gray+' Total: '.blue+'$'+total);
    console.log(' ============================================'.gray);

    res.status(200).json({'tickets': printedTickets, 'total':total});
  });

  return router;
};
