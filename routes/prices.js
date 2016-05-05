var express = require('express');
var router = express.Router();

var prices = require('../data/prices.json')

// define the index route
router.get('/', function(req, res) {
  res.json({'prices': prices});
});

module.exports = router;
