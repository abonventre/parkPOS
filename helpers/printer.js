'use strict';

var printer = require("printer"),
  	fs = require('fs'),
    util = require('util'),
    moment = require('moment'),
    config = require('../data/config.json'),
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
      ];
      printThis(template);

  }

  module.printCloseOut = function(lot, shift, breakdown, ticketTotal, drops, dropTotal, deposit){
      console.log("printCloseOut() invoked.");
      var template = [
        initializePrinter,
        "\nLEFT",
        "\nML 30",
        "\nTEXT 7 0 60 240",
        "\nLot: "+lot,
        "\nShift: "+shift.shiftID,
        "\nEmployee: "+shift.user,
        "\nStart: "+moment(shift.startDate).format("M/D/YY h:mma"),
        "\nEnd: "+moment(shift.endDate).format("M/D/YY h:mma"),
        "\n",
        "\n==Breakdown=="
      ];
      for (var key in breakdown) {
        template.push("\n"+key+": $"+breakdown[key]);
      }
      template.push(
        "\nTotal: $"+ticketTotal,
        "\n",
        "\n==Drops=="
      );
      for (var i = 0; i < drops.length; i++) {
        template.push("\n$"+drops[i].amount+" ("+drops[i].name+" @ "+moment(drops[i].timestamp).format("h:mma")+")");
      }
      template.push(
        "\nTotal: $"+dropTotal,
        "\n",
        "\n==Totals==",
        "\nSold: $"+ticketTotal,
        "\nDrops: $"+dropTotal,
        "\nFinal Deposit: $"+deposit,
        "\nOver/Under: $"+((dropTotal+deposit)-ticketTotal)
      );
      template.push("\nENDML");
      template.push(finalizePrinter);
      printThis(template);
  }

  function printThis(template) {
    if(!config.printProduction){
      console.log("Simulated print.".red +"  If you want to actually print, please adjust the 'printProduction' setting in the config.json file in /data.".gray);
    }else{
      var buffer = new Buffer(template.join(''));
      // console.log(template);
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
                // console.log("current job info:"+util.inspect(jobInfo, {depth: 10, colors:true}));
                return jobID;
          },
          error:function(err){
            console.log(err);
            return err;
          }
      });
    }

  }

  return module;
}
