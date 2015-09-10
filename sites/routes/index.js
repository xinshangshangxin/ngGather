'use strict';

var express = require('express');
var router = express.Router();
var serverGet = {};

router
  .use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, HEAD, PUT, UPDATE'
    );
    next();
  })
  .get('/', function(req, res) {
    res.render('index.html');
  })
  .get('/getimg', function(req, res) {
    serverGet.getImg(req, res);
  })
  .get('/getinfo', function(req, res) {
    serverGet.getInfo(req, res);
  })
  .get('/getlatest', function(req, res) {
    serverGet.getLatest(req, res);
  })
  .get('/getupdatetime', function(req, res) {
    serverGet.getUpdateTime(req, res);
  });

module.exports = router;
