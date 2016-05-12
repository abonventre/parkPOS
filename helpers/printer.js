'use strict';

var printer = require("printer"),
  	fs = require('fs'),
    util = require('util'),
    moment = require('moment'),
    printerName = 'Zebra_RW_420',
    printerSpeed = 5,
    printerFormat = 'RAW',
    initializePrinter = '! 0 200 200 1100 1\nPW 500\nSPEED '+printerSpeed,
    blockWaterTaxiText = '\nPATTERN 103\nLINE 420 490 500 490 406',
    finalizePrinter = '\nFORM\nPRINT\n';

module.exports = function(){
  var module = {};

  module.printTicket = function(startDate, endDate, days, total, serial, disclaimer){
      console.log("printTicket() invoked.");
      console.log(endDate);
      var template = [
        initializePrinter,
        "\nCENTER",
        "\nML 40\nTEXT 0 3 0 30\n"+disclaimer.join("\n")+"\nENDML",
        blockWaterTaxiText,
        "\nTEXT270 4 0 420 290 Fire Island Terminal Inc.",
        "\nLEFT",
        "\nTEXT270 4 0 350 250 Entered: "+moment(startDate).format("MM-DD-YYYY"),
        "\nTEXT270 4 0 300 250 Paid Through: "+moment(endDate).format("MM-DD-YYYY"),
        "\nTEXT270 4 0 250 250 Days: "+days,
        "\nTEXT270 4 0 200 250 Total: $"+total,
        finalizePrinter
      ]
      var buffer = new Buffer(template.join(''));
      console.log(template);
      printer.printDirect({
          data: buffer, // Send the buffer to printer using CPCL
        	printer:printerName, // printer name
        	type: printerFormat, // Use RAW for direct CPCL buffer communication
          options:
          {
              media: '2.5x5.5in',
              'fit-to-page': true
          },
        	success:function(jobID){
        		console.log("sent to printer with ID: "+jobID);
                var jobInfo = printer.getJob(printerName, jobID);
                console.log("current job info:"+util.inspect(jobInfo, {depth: 10, colors:true}));
        	},
        	error:function(err){
            console.log(err);
            return err;
          }
      });
  }

  return module;
}
