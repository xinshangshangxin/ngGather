'use strict';

var express = require('express');
var router = express.Router();

router
  .get('/api/v1/test', function(req, res) {
    res.json({
      test: true,
    });
  })
;

module.exports = router;
