'use strict';

var express = require('express');
var router = express.Router();


module.exports = function(prices, config){
  var priceCalculator = require('../helpers/priceCalculator')(prices, config);
  // define the index route
  router.get('/', function(req, res) {
    var dayTable = priceCalculator.dayTable();
    res.json({'prices': prices,'dayTable': dayTable});
  });

  return router;
};
