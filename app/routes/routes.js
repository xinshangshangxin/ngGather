'use strict';

var cors = require('cors');
var express = require('express');
var router = express.Router();

var articleController = require('../controllers/articleController.js');
var executeCmdController = require('../controllers/executeCmdController.js');
var tokenAuth = require('../policies/tokenAuth.js');
var wrapError = require('../policies/wrapError.js');
var utilitiesService = require('../services/utilitiesService.js');

var execCmdKey = config.execCmdKey;

router
  .all('*', wrapError)
  .all(/^\/(?=api)/, cors())
  .all(/^\/(?=api\/v\d+\/execCmds)/, function(req, res, next) {
    if((req.query.key || req.body.key) === execCmdKey) {
      return next();
    }
    return res.json(400, {
      code: 1001
    });
  })
  .get(/^\/(?!api)/, function(req, res) {
    res.render('index.html');
  })
  .get(/^\/(?=api\/v\d+\/execCmds)/, executeCmdController.help)
  .post(/^\/(?=api\/v\d+\/execCmds)/, tokenAuth(), executeCmdController.execCmds)
  .get('/api/v1/sites', function(req, res) {
    if(req.query.force) {
      articleController.taskUpdate();
      return res.json({
        start: true
      });
    }
    articleController.getSites(req, res);
  })
  .get('/api/v1/updateTime', function(req, res) {
    res.json({
      updateTime: articleController.updateTime()
    });
  })
  .get('/api/v1/tasks', function(req, res) {
    articleController.taskUpdate();
    return res.json({});
  })
  .get('/api/v1/getImg', function(req, res) {
    return utilitiesService.getImg(req, res);
  })
  .get('/api/v1/allSites', articleController.getSitesStatus)
  .get('/api/v1/status', articleController.getStatus)
;

module.exports = router;
