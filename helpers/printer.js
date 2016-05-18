'use strict';

var printer = require("printer"),
  	fs = require('fs'),
    util = require('util'),
    moment = require('moment'),
    config = require('../data/config.json'),
    printerName = config.printerName,
    printerSpeed = 5,
    printerFormat = 'RAW',
    initializePrinter = '! 0 200 200 1100 1\nPW 500\nSPEED '+printerSpeed,
    blockWaterTaxiText = '\nPATTERN 103\nLINE 420 490 500 490 406',
    finalizePrinter = '\nFORM\nPRINT\n';

module.exports = function(){
  var module = {};

  module.printTicket = function(lot, startDate, endDate, days, total, serial, disclaimer){
      console.log("printTicket() invoked.");
      console.log(endDate);
      var template = [
        initializePrinter,
        "\nCENTER",
        "\nML 25\nTEXT 7 0 0 15\n"+disclaimer.join("\n")+"\nENDML",
        "\nML 25\nTEXT270 7 0 150 600\n"+disclaimer.join("\n")+"\nENDML",
        "\nML 25\nTEXT 7 0 0 105",
        "\nIn: "+moment(startDate).format("M/D/YY")+" Out: "+moment(endDate).format("M/D/YY"),
        "\nTotal: $"+total+" Serial: "+serial,
        "\nENDML",
        blockWaterTaxiText,
        "\nTEXT270 4 0 410 290 Fire Island Terminal Inc.",
        "\nLEFT",
        "\nTEXT90 7 0 20 150 | RECEIPT |",
        "\nTEXT270 7 0 490 20 | RECEIPT |",
        "\nTEXT270 4 0 450 250 "+moment(startDate).format("YYYY"),
        "\nINVERSE-LINE 400 350 400 240 55",
        "\nPATTERN 100",
        "\nLINE 175 240 175 1050 5",
        "\nLINE 175 625 75 625 5",
        "\nTEXT270 7 0 150 225 Lot:",
        "\nTEXT270 4 0 130 225 "+lot.substring(0,4),
        "\nTEXT270 7 0 150 340 Serial:",
        "\nTEXT270 4 0 130 340 "+serial,
        "\nTEXT270 4 0 360 225 In: ",
        "\nTEXT270 4 3 305 225 "+moment(startDate).format("M/D"),
        "\nTEXT270 7 0 225 225 "+moment(startDate).format("dddd"),
        "\nTEXT270 4 0 360 500 Out: ",
        "\nTEXT270 4 3 305 500 "+moment(endDate).format("M/D"),
        "\nTEXT270 7 0 225 500 "+moment(endDate).format("dddd"),
        "\nTEXT270 4 0 360 800 Total: ",
        "\nTEXT270 4 3 305 800 $"+total,
        "\nTEXT270 4 0 360 800 Total: ",
        "\nTEXT270 4 3 305 800 $"+total,
        // "\nTEXT270 4 0 300 250 Paid Through: "+moment(endDate).format("MM-DD-YYYY"),
        // "\nTEXT270 4 0 250 250 Days: "+days,
        // "\nTEXT270 4 0 200 250 Total: $"+total,
        finalizePrinter
      ];
      printThis(template);

  }

  module.printDrop = function(lot, timestamp, shift, name, amount){
      console.log("printTicket() invoked.");
      var template = [
        initializePrinter,
        "\nCENTER",
        blockWaterTaxiText,
        "\nTEXT270 4 0 420 290 This is a Drop Receipt!",
        "\nLEFT",
        "\nTEXT270 4 0 350 250 Shift: "+shift.shiftID,
        "\nTEXT270 4 0 350 550 Lot: "+lot,
        "\nTEXT270 4 0 300 250 Employee: "+shift.user,
        "\nTEXT270 4 0 250 250 Timestamp: "+moment(timestamp).format("M/D/YY h:mm:a"),
        "\nTEXT270 4 0 200 250 Name: "+name,
        "\nTEXT270 4 0 150 250 Amount: $"+amount,
        finalizePrinter
      ];
      printThis(template);

  }

  module.printCloseOut = function(lot, shift, breakdown, ticketTotal, drops, dropTotal, deposit){
      console.log("printCloseOut() invoked.");
      shift.end_date = shift.endDate;
      shift.start_date = shift.startDate;
      var template = [
        initializePrinter,
        "\nLEFT",
        "\nML 30",
        "\nTEXT 7 0 60 240",
        "\nLot: "+lot,
        "\nShift: "+shift.shiftID,
        "\nEmployee: "+shift.user,
        "\nStart: "+moment(shift.start_date).format("M/D/YY h:mma"),
        "\nEnd: "+moment(shift.end_date).format("M/D/YY h:mma"),
        "\n",
        "\n==Breakdown=="
      ];
      for (var key in breakdown) {
        template.push("\n"+key+": ("+breakdown[key].qty+") $"+breakdown[key].total);
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
      console.log("Simulated print.".red +"  If you want to actually print, please set the 'printProduction' setting to 'true' in the config.json file in /data.".gray);
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
                // var jobInfo = printer.getJob(printerName, jobID);
                // console.log("current job info:"+util.inspect(jobInfo, {depth: 10, colors:true}));
                return jobID;
          },
          error:function(err){
            console.log("printThis Error:");
            console.log(err);
            return err;
          }
      });
    }

  }

  module.checkJob = function(job) {
    var jobID = job*1;
    var jobInfo = printer.getJob(printerName, jobID);
    return jobInfo;
  }

  return module;
}
