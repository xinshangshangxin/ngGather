'use strict';

var express = require('express');
var router = express.Router();

var execCmdAuth = require('../policies/execCmdAuth');
var executeCmdController = require('../controllers/executeCmdController');
var tokenAuth = require('../policies/tokenAuth');

router
  .all('/api/:version(v\\d+)/cmds', execCmdAuth())
  .get('/api/:version(v\\d+)/cmds', executeCmdController.help)
  .post('/api/:version(v\\d+)/cmds', tokenAuth(), executeCmdController.execCmds)
  // auto deploy
  .post('/api/v1/auto-deploy', function (req, res) {
    res.end('ok');

    executeCmdController
      .tryAutoDeploy(req.body)
      .then(function (data) {
        logger.info(data);
      })
      .catch(function (e) {
        logger.info(e);
      });
  });

module.exports = router;