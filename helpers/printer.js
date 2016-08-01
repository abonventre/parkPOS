'use strict';

var printer = require("printer"),
  	fs = require('fs'),
    util = require('util'),
    moment = require('moment'),
    config = require('../data/config.json'),
    printerName = config.printerName,
    printerSpeed = 5,
    printerFormat = 'RAW',
    initializePrinter =  {
      'RW420' : '! 0 200 200 1100 1\nPW 500\nSPEED '+printerSpeed,
      'GK420' : "~JSO^XA^PR"+printerSpeed+"^PW507^MMT^LL1117^LH0"
    },
    blockWaterTaxiText = {
      'RW420' : '\nPATTERN 103\nLINE 420 490 500 490 406',
      'GK420' : "^FO25,175^BY3^B1B,N,76,N,N^FD112234567^FS"
    },
    finalizePrinter =
    {
      'RW420' : '\nFORM\nPRINT\n',
      'GK420' : "^XZ"
    };

module.exports = function(){
  var module = {};

  module.printerList = function() {
    var printers = printer.getPrinters(),
        availablePrinters = [];
    for (var i = 0; i < printers.length; i++) {
      if(printers[i].name === "Zebra_RW_420" || printers[i].name === "Zebra_GK_420"){
          availablePrinters.push(printers[i].name);
      }
    }
    return availablePrinters;
  };

  module.printTicket = function(lot, startDate, endDate, days, total, serial, disclaimer){
      console.log("printTicket() invoked.");
      console.log(endDate);
      var template = [];
      if(printerName == "Zebra_GK_420"){
        console.log("Printing to GK420");
        template = [
        	initializePrinter.GK420,
        	"^FO0,900^ADN,10,7^FB507,3,5,C^FD"+disclaimer.join(" \\&")+"^FS",
        	"^FO0,975^ADN,10,7^FB507,2,5,C^FDIn: "+moment(startDate).format("M/D/YY")+" Out: "+moment(endDate).format("M/D/YY")+" \\& Total: $"+total+" Serial: "+serial+"^FS",
        	"^FO20,910^ADB,25,14^FD RECEIPT ^FS",
        	"^FO480,910^ADR,25,14^FD RECEIPT ^FS",

          blockWaterTaxiText.GK420,

          "^FO100,100^AUB,38,16^FD Fire Island Terminal, Inc.^FS",

        	"^FT180,800^A0B,28,28^FH\^FDIn:^FS",
        	"^FT180,507^A0B,28,28^FH\^FDOut:^FS",
        	"^FT180,200^A0B,28,28^FH\^FDTotal:^FS",

        	//In
        	"^FT265,800^A0B,96,98^FH\^FD"+moment(startDate).format("M/D")+"^FS",
        	//Out
        	"^FT265,507^A0B,96,98^FH\^FD"+moment(endDate).format("M/D")+"^FS",
        	//Total
        	"^FT265,200^A0B,96,98^FH\^FD$"+total+"^FS",

        	//In
        	"^FT300,800^A0B,23,24^FH\^FD"+moment(startDate).format("dddd")+"^FS",
        	//Out
        	"^FT300,507^A0B,23,24^FH\^FD"+moment(endDate).format("dddd")+"^FS",

        	//Lines
        	"^FO330,30^GB0,775,8^FS",
        	"^FO330,454^GB124,0,8^FS",

        	//Discalaimer2
        	"^FT420,475^ADB,10,7^FB507,3,5,C^FD"+disclaimer.join(" \\&")+"^FS",

        	"^FT380,800^A0B,17,16^FH\^FDLot:^FS",
        	"^FT410,800^A0B,34,33^FH\^FD"+lot.substring(0,4)+"^FS",
        	"^FT380,710^A0B,17,16^FH\^FDSerial: ^FS",
        	"^FT410,710^A0B,34,33^FH\^FD"+serial+"^FS",

        	"^LRY^FO50,705^GB70,115,70,,3^FS^FT100,800^A0B,40,38^FH\^FD"+moment(startDate).format("YYYY")+"^FS^LRN",
        	finalizePrinter.GK420
        ];
        var buffer = template.join("");
        printThis(buffer);
      }else if (printerName == "Zebra_RW_420"){
        console.log("Printing to RW420");
        template = [
          initializePrinter.RW420,
          "\nCENTER",
          "\nML 25\nTEXT 7 0 0 15\n"+disclaimer.join("\n")+"\nENDML",
          "\nML 25\nTEXT270 7 0 150 600\n"+disclaimer.join("\n")+"\nENDML",
          "\nML 25\nTEXT 7 0 0 105",
          "\nIn: "+moment(startDate).format("M/D/YY")+" Out: "+moment(endDate).format("M/D/YY"),
          "\nTotal: $"+total+" Serial: "+serial,
          "\nENDML",
          blockWaterTaxiText.RW420,
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
          finalizePrinter.RW420
        ];
        var buffer = new Buffer(template.join(''));
        printThis(buffer);
      }



  };

  module.printDrop = function(lot, timestamp, shift, name, amount){
      console.log("printTicket() invoked.");
      var template = [];
      if(printerName == "Zebra_GK_420"){
        console.log("Printing to GK420");
        template = [
        	initializePrinter.GK420,

          "^FT386,473^A0B,23,24^FH\^FDAmount:^FS",
          "^FT459,58^A0I,76,76^FH\^FDDrop Receipt^FS",
          "^FT182,473^A0B,23,24^FH\^FDDropped By:^FS",
          "^FT282,473^A0B,23,24^FH\^FDTimestamp:^FS",
          "^FT386,802^A0B,23,24^FH\^FDLot:^FS",
          "^FT432,473^A0B,31,31^FH\^FD$"+amount+"^FS",
          "^FT432,802^A0B,31,31^FH\^FD"+lot+"^FS",
          "^FT327,802^A0B,31,31^FH\^FD"+shift.shiftID+"^FS",
          "^FT327,473^A0B,31,31^FH\^FD"+moment(timestamp).format("M/D/YY h:mm:a")+"^FS",
          "^FT226,473^A0B,31,31^FH\^FD"+name+"^FS",
          "^FT226,802^A0B,31,31^FH\^FD"+shift.user+"^FS",
          "^FT282,802^A0B,23,24^FH\^FDShift:^FS",
          "^FT180,802^A0B,23,24^FH\^FDEmployee:^FS",
        	finalizePrinter.GK420
        ];
        var buffer = template.join("");
        printThis(buffer);
      }else if (printerName == "Zebra_RW_420"){
        console.log("Printing to RW420");
        template = [
          initializePrinter.RW420,
          "\nCENTER",
          blockWaterTaxiText.RW420,
          "\nTEXT270 4 0 420 290 This is a Drop Receipt!",
          "\nLEFT",
          "\nTEXT270 4 0 350 250 Shift: "+shift.shiftID,
          "\nTEXT270 4 0 350 550 Lot: "+lot,
          "\nTEXT270 4 0 300 250 Employee: "+shift.user,
          "\nTEXT270 4 0 250 250 Timestamp: "+moment(timestamp).format("M/D/YY h:mm:a"),
          "\nTEXT270 4 0 200 250 Name: "+name,
          "\nTEXT270 4 0 150 250 Amount: $"+amount,
          finalizePrinter.RW420
        ];
        var buffer = new Buffer(template.join(''));
        printThis(buffer);
      }

  };

  module.printCloseOut = function(lot, shift, breakdown, ticketTotal, drops, dropTotal, deposit){
      console.log("printCloseOut() invoked.");
      var template = [];
      if(printerName == "Zebra_GK_420"){
        console.log("Printing to GK420");
        template = [
          initializePrinter.GK420,

          "^FO120,20^ADN,10,7^FB507,800,5,L^FD",
          "Lot: "+lot+" \\&",
          "Shift: "+shift.shiftID+" \\&",
          "Employee: "+shift.user+" \\&",
          "Start: "+moment(shift.startDate).format("M/D/YY h:mma")+" \\&",
          "End: "+moment(shift.endDate).format("M/D/YY h:mma")+" \\&",
          "\\&",
          "==Breakdown== \\&"
        ];
        for (var key in breakdown) {
          template.push(key+": ("+breakdown[key].qty+") $"+breakdown[key].total+" \\&");
        }
        template.push(
          "Total: $"+ticketTotal+" \\&",
          "\\&",
          "==Drops== \\&"
        );
        for (var i = 0; i < drops.length; i++) {
          template.push("$"+drops[i].amount+" ("+drops[i].name+" @ "+moment(drops[i].timestamp).format("h:mma")+") \\&");
        }
        template.push(
          "Total: $"+dropTotal+" \\&",
          "\\&",
          "==Totals=="+" \\&",
          "Sold: $"+ticketTotal+" \\&",
          "Drops: $"+dropTotal+" \\&",
          "Final Deposit: $"+deposit+" \\&",
          "Over/Under: $"+((dropTotal+deposit)-ticketTotal+" \\&")
        );
        template.push("^FS");
        template.push(finalizePrinter.GK420);
        var buffer = template.join("");
        printThis(buffer);
      }else if (printerName == "Zebra_RW_420"){
        console.log("Printing to RW420");
        template = [
          initializePrinter.RW420,
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
        template.push(finalizePrinter.RW420);
        var buffer = new Buffer(template.join(''));
        printThis(buffer);
      }
  };

  function printThis(buffer) {
    if(!config.printProduction){
      console.log("Simulated print.".red +"  If you want to actually print, please set the 'printProduction' setting to 'true' in the config.json file in /data.".gray);
    }else{
      // var buffer = new Buffer(template.join(''));
      // console.log(template);
      // console.log(buffer);

      printer.printDirect({
          data: buffer, // Send the buffer to printer using CPCL
          printer: printerName, // printer name
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
            console.log("end printThis error.");
            return err;
          }
      });
    }

  }

  module.checkJob = function(job) {
    var jobID = job*1;
    var jobInfo = printer.getJob(printerName, jobID);
    return jobInfo;
  };

  return module;
};
