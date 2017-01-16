'use strict';

/**
 * 采集所有页面
 *
 */

require('../config/globalInit.js');
var gather = require('gather-site');
var articleModel = require('../models/articleModel').articleModel;

function getZeroDay(date) {
  date = date ? (new Date(date)) : (new Date());
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function updateErrorDate() {
  var today = getZeroDay();

  return Promise
    .try(function () {
      return articleModel
        .find({
          $or: [{
            gatherTime: {
              $gte: today.getTime()
            },
          }, {
            time: {
              $gte: today.getTime()
            },
          }],
        });
    })
    .map(function (article) {
      var time = new Date(article.time);
      time.setFullYear(time.getFullYear() - 1);
      return article.update({
        gatherTime: time.getTime(),
        time: time.getTime(),
      });
    });
}

function closeConnection() {
  require('../services/dbService').closeMongoose();
  gather.proxyPool.clearAll();
}


updateErrorDate()
  .then(function (data) {
    console.log(data);
  })
  .catch(function (e) {
    console.log(e);
  })
  .finally(function () {
    closeConnection();
  });

