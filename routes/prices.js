var express = require('express');
var router = express.Router();


module.exports = function(prices, config){
  // define the index route
  router.get('/', function(req, res) {
    res.json({'prices': prices});
  });

  return router;
};
