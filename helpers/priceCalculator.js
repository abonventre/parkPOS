'use strict';

var moment = require('moment');
var holidays = require('../data/holidays.json');

module.exports = function(prices, config){
  var module = {};

  module.days = function(days){
    var total = 0,
        daysRemaining = days,
        daysArray = [],
        startDate = moment().format();

    for(var i=0, len=days; i<len; i++){
      var duration = moment.duration({'days' : i}),
          newDate = moment(startDate).add(duration),
          holiday = false;

      for (var j = 0;  j < holidays.dates.length; j++) {
        if(newDate.format('M/D/YYYY') == holidays.dates[j].date){
          console.log(("Holiday on "+holidays.dates[j].date).red.underline);
          daysArray.push(6);
          holiday = true;
        }
      }

      if(!holiday){
        // console.log('Regular'.blue);
        daysArray.push(newDate.day());
      }

      // console.log(daysArray);

    }

    while(daysRemaining > 0){
      if(daysRemaining >= 30){
        // Monthly
        total += prices.monthly;
        daysRemaining -= 30;
        daysArray.splice(0,30);
      }else if(daysRemaining >= 7){
        // Weekly
        total += prices.weekly;
        daysRemaining -= 7;
        daysArray.splice(0,7);
      }else if(daysArray[0] == 5 && daysArray[1] == 6 && daysArray[2] == 0 && config.weekendSpecial){
        // Weekend Special
        total += prices.weekendSpecial;
        daysRemaining -= 3;
        daysArray.splice(0,3);
      }else if(daysArray[0] == 5 && config.fridaySpecial){
        // Special Friday Pricing
        total += prices.friday;
        daysRemaining -= 1;
        daysArray.splice(0,1);
      }else if(isInArray(daysArray[0], config.weekDays)){
        // Daily
        total += prices.daily;
        daysRemaining -= 1;
        daysArray.splice(0,1);
      }else if(isInArray(daysArray[0], config.weekendDays)){
        total += prices.weekend;
        daysRemaining -= 1;
        daysArray.splice(0,1);
      }else{
        console.log("Woops");
      }


    };
    return total;
    // res.json({'daysArray':daysArrayOG, 'total': total});

    function isInArray(value, array) {
      return array.indexOf(value) > -1;
    }
  };

  module.dayTable = function() {
    var daysToGet = 6;
    var table = {};
    for(var i=1, len=daysToGet; i<=len; i++){
      table[i] = module.days(i);
    }
    table[7] = prices.weekly;
    table[30] = prices.monthly;
    return table;
  }

  return module;
}
