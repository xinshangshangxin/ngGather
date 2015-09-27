'use strict';

var express = require('express');
var router = express.Router();
var article = require('../models/article.js');
var utilitiesService = require('../service/utilitiesService.js');

router
  .use(/^\/(?=api)/, function(req, res, next) {
    console.log('api');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, HEAD, PUT, UPDATE'
    );
    next();
  })
  .get(/^\/(?!api)/, function(req, res) {
    res.render('index.html');
  })
  .get('/api/v1/sites', function(req, res) {
    if (req.query.force) {
      article.taskUpdate();
      return res.json({});
    }
    article.getSites(req, res);
  })
  .get('/api/v1/updateTime', function(req, res) {
    res.json({
      updateTime: article.updateTime()
    });
  })
  .get('/api/v1/tasks', function(req, res) {
    article.taskUpdate();
    return res.json({});
  })
  .get('/api/v1/getImg', function(req, res) {
    return utilitiesService.getImg(req, res);
  });

module.exports = router;
