'use strict';

var printer = require("printer"),
  	fs = require('fs'),
    util = require('util'),
    printerName = 'Zebra_RW_420',
    printerSpeed = 5,
    printerFormat = 'RAW',
    date = 'Sunday 10',
    disclaimer = ['This ticket blablabla', 'and is only valid bla bla bla', 'theft, fire bla bla bla'];

module.exports = function(){
  var module = {};

  var buffer = new Buffer("! 0 200 200 1100 1\nSPEED "+printerSpeed+"\nCENTER\nTEXT 0 3 30 30 "+disclaimer[0]+"\nTEXT 0 3 30 50 "+disclaimer[1]+"\nTEXT 0 3 30 70 "+disclaimer[2]+"\nPATTERN 103\nLINE 420 490 500 490 406\nFORM\nPRINT\n");
  module.print = function(startDate, endDate, total, serial){
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
                if(jobInfo.status.indexOf('PRINTED') !== -1)
                {
                    console.log('too late, already printed');
                    return;
                }
               	console.log("Printing");
        	},
        	error:function(err){
            console.log(err);
          }
      });
  }

  return module;
}
