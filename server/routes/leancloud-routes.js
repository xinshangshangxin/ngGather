'use strict';

var express = require('express');
var router = express.Router();

router
  .all('/1.1/functions/_ops/metadatas', function (req, res) {
    // leancloud不使用云函数和Hook
    res.send(404);
  })
;

module.exports = router;
