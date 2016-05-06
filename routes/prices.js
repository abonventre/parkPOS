'use strict';

var express = require('express');
var router = express.Router();

var moment = require('moment');

module.exports = function(prices, config){
  var priceCalculator = require('../helpers/priceCalculator')(prices, config);
  // define the index route
  router.get('/', function(req, res) {
    var dayTable = priceCalculator.dayTable();
    res.json({'prices': prices,'dayTable': dayTable});
  });

  router.get('/date/:date', function(req, res) {
    console.log(req.params.date);
    var date = moment(req.params.date);
    var today = moment();
    var days = Math.ceil(date.diff(today, 'days', true));
    console.log(days);
    var price = priceCalculator.days(days);
    res.json({'days': days, 'price': price});
  });

  return router;
};
