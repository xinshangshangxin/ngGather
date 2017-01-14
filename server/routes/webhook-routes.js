'use strict';

var express = require('express');
var router = express.Router();

var webhookController = require('../controllers/webhookController');

router
  .get('/api/v1/webhook-event', webhookController.queryEvent)
  .get('/api/v1/webhook', webhookController.query)
  .get('/api/v1/webhook/:id', webhookController.get)
  .post('/api/v1/webhook', webhookController.create)
  .put('/api/v1/webhook/:id', webhookController.update)
  .delete('/api/v1/webhook/:id', webhookController.destroy)
;

module.exports = router;