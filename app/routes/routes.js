'use strict';

var cors = require('cors');
var express = require('express');
var router = express.Router();

var articleController = require('../controllers/articleController.js');
var executeCmdController = require('../controllers/executeCmdController.js');
var tokenAuth = require('../policies/tokenAuth.js');
var WebhookController = require('../controllers/WebhookController');
var wrapError = require('../policies/wrapError.js');
var utilitiesService = require('../services/utilitiesService.js');

var execCmdKey = config.env.execCmdKey;

router
  .all('*', wrapError)
  .all(/^\/(?=api)/, cors())
  .all(/^\/(?=api\/v\d+\/cmds)/, function(req, res, next) {
    if((req.query.key || req.body.key) === execCmdKey) {
      return next();
    }
    res.wrapError({
      code: 1001,
      msg: '无权限执行cmd'
    }, null, 401);
  })
  .get(/^\/(?!api)/, function(req, res) {
    res.render('index.html');
  })
  .get(/^\/(?=api\/v\d+\/cmds)/, executeCmdController.help)
  .post(/^\/(?=api\/v\d+\/cmds)/, tokenAuth(), executeCmdController.execCmds)
  .post('/api/v1/auto-deploy', function(req, res) {
    res.end('ok');

    executeCmdController
      .tryAutoDeploy(req.body)
      .then(function(data) {
        console.log(data);
      })
      .catch(function(e) {
        console.log(e);
      });
  })
  .get('/api/v1/webhook-event', WebhookController.queryEvent)
  .get('/api/v1/webhook', WebhookController.query)
  .get('/api/v1/webhook/:id', WebhookController.get)
  .post('/api/v1/webhook', WebhookController.create)
  .put('/api/v1/webhook/:id', WebhookController.update)
  .delete('/api/v1/webhook/:id', WebhookController.destroy)
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
