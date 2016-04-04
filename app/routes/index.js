'use strict';

/**
 * 1001: 无权限
 */

var express = require('express');
var router = express.Router();
var article = require('../models/article.js');
var utilitiesService = require('../service/utilitiesService.js');
var specialCmds = require('../models/specialCmds.js');

router
  .all(/^\/(?=api)/, function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, HEAD, PUT, UPDATE'
    );
    next();
  })
  .all(/^\/(?=api\/v\d+\/execCmds)/, function(req, res, next) {
    if((req.query.key || req.body.key) === (process.env.key || 'key')) {
      return next();
    }
    return res.json(400, {
      err: 1001
    });
  })
  .get(/^\/(?!api)/, function(req, res) {
    res.render('index.html');
  })
  .get('/api/v1/sites', function(req, res) {
    if(req.query.force) {
      article.taskUpdate();
      return res.json({
        start: true
      });
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
  })
  .get('/api/v1/allSites', article.getSitesStatus)
  .get(/^\/(?=api\/v\d+\/execCmds)/, function(req, res) {
    res.json(specialCmds.helpInfo);
  })
  .post(/^\/(?=api\/v\d+\/execCmds)/, function(req, res) {
    specialCmds.execCmds(req, res);
  });

module.exports = router;
