var printer = require("printer")
	fs = require('fs'),
   util = require('util'),
    printerName = 'Zebra',
    printerSpeed = 5,
    printerFormat = 'RAW',
    date = 'Sunday 10',
		disclaimer = [
	    "Management is not responsible",
	    "for theft or damage to vehicles",
	    "or contents on this property."
	  ],
		initializePrinter = "~JSO^XA^PR"+printerSpeed+"^PW507^MMT^LL1117^LH0",
		finalizePrinter = "^XZ";

console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));

// var buffer = new Buffer("! 0 200 200 1100 1\nSPEED "+printerSpeed+"\nCENTER\nTEXT 0 3 30 30 "+disclaimer[0]+"\nTEXT 0 3 30 50 "+disclaimer[1]+"\nTEXT 0 3 30 70 "+disclaimer[2]+"\nPATTERN 103\nLINE 420 490 500 490 406\nFORM\nPRINT\n");
// var buffer = "^FO50,50^ADN,36,20^FDANTHONY^FS^XZ";
 //var buffer = "~JS";
var template = [
	initializePrinter,
	"^FO0,900^ADN,10,7^FB507,3,5,C^FD"+disclaimer.join(" \\&")+"^FS",
	"^FO0,975^ADN,10,7^FB507,2,5,C^FDIn: 7/28/16 Out: 7/28/16 \\& Total: $10 Serial: 154SAB1194^FS",
	"^FO20,910^ADB,25,14^FD RECEIPT ^FS",
	"^FO480,910^ADR,25,14^FD RECEIPT ^FS",
	"^FO25,175^BY3^B1B,N,76,N,N^FD112234567^FS", //Cover FIWT Name with barcode
	"^FO100,100^AUB,38,16^FD Fire Island Terminal, Inc.^FS",

	"^FT180,800^A0B,28,28^FH\^FDIn:^FS",
	"^FT180,507^A0B,28,28^FH\^FDOut:^FS",
	"^FT180,200^A0B,28,28^FH\^FDTotal:^FS",

	//In
	"^FT265,800^A0B,96,98^FH\^FD7/28^FS",
	//Out
	"^FT265,507^A0B,96,98^FH\^FD12/28^FS",
	//Total
	"^FT265,200^A0B,96,98^FH\^FD$189^FS",

	//In
	"^FT300,800^A0B,23,24^FH\^FDThursday^FS",
	//Out
	"^FT300,507^A0B,23,24^FH\^FDThursday^FS",

	//Lines
	"^FO330,30^GB0,775,8^FS",
	"^FO330,454^GB124,0,8^FS",

	//Discalaimer2
	"^FT420,475^ADB,10,7^FB507,3,5,C^FD"+disclaimer.join(" \\&")+"^FS",

	"^FT380,800^A0B,17,16^FH\^FDLot:^FS",
	"^FT410,800^A0B,34,33^FH\^FDSalt.^FS",
	"^FT380,710^A0B,17,16^FH\^FDSerial: ^FS",
	"^FT410,710^A0B,34,33^FH\^FD133SAB1194^FS",

	"^LRY^FO50,705^GB70,115,70,,3^FS^FT100,800^A0B,40,38^FH\^FD2016^FS^LRN",
	finalizePrinter
];

var buffer = template.join("");

console.log(buffer);
printer.printDirect({
    //data: fs.readFileSync('test.pdf'),
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
  //       console.log('cancelling...');
  //       var is_ok = printer.setJob(printerName, jobID, 'CANCEL');
		// console.log("cancelled: "+is_ok);
		// try{
		// 	console.log("current job info:"+util.inspect(printer.getJob(printerName, jobID), {depth: 10, colors:true}));
		// }catch(err){
		// 	console.log('job deleted. err:'+err);
		// }
	},
	error:function(err){console.log(err);}
});

// var test = setInterval(function() {
// 	console.log("testing");
// },1000);

// test;
