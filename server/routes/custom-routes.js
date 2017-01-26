'use strict';

var express = require('express');
var router = express.Router();
var articleController = require('../controllers/articleController');
var utilitiesService = require('../services/utilitiesService');

router
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
  .get('/api/v1/proxy/img', function(req, res) {
    return utilitiesService.getImg(req, res);
  })
  .get('/api/v1/allSites', articleController.getSitesStatus)
  .get('/api/v1/status', articleController.getStatus)
;

module.exports = router;
