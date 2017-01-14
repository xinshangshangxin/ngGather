'use strict';

var express = require('express');
var router = express.Router();

router
  // exec cmd
  .get(/^\/(?!api)/, function(req, res) {
    res.render('index.html');
  })
;

module.exports = router;
