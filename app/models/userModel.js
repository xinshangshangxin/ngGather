'use strict';

var dbService = require('../services/dbService.js');

var user = dbService.define('user', {
  username: {
    type: String,
    required: true,
    unique: true
  }
});

var userModel = user.model;

module.exports = userModel;