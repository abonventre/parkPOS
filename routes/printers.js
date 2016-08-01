var express = require('express');
var router = express.Router();

var jsonfile = require('jsonfile');

var colors = require('colors');

var ticketPrinter = require('../helpers/printer')();

module.exports = function(config){
  // define the home page route
  router.get('/', function(req, res) {
    res.send('Printers Home');
  });

  // define the home page route
  router.get('/list', function(req, res) {
    var printers = ticketPrinter.printerList();
    if(printers.length > 0){
      res.status(200).json(ticketPrinter.printerList());
    }else{
      return res.status(500).json({'message':'There was an error finding a printer. Is it installed?'});
    }

  });

  router.post('/set', function(req, res) {
    console.log(req.body);
    var printer = req.body.printer;
    if(!printer){
      return res.status(500).json({'message':'Can\'t set printer, no printer selected.'});
    }

    var file = './data/config.json';

    jsonfile.readFile(file, function (err, obj) {
      if(err) return res.status(500).json({'message':'Can\'t set printer, error reading config file.'});
      obj.printerName = printer;
      jsonfile.writeFile(file, obj, {spaces: 2}, function(err) {
        if(err) return res.status(500).json({'message':'Can\'t set printer, error saving config file.'});
        res.status(200).json(printer);
      });
    });
  });


  return router;
};
