'use strict';

/**
 * LLM早期采集有问题,删除之
 */

var utilService = require('../sites/service/utilitiesService.js');
var articleDao = require('../sites/daos/articleDao.js');
var articleModel = articleDao.articleModel;


articleModel
  .remove({
    site: /llm/i,
    gatherTime: {
      $gte: utilService.getFewDaysAgo(0).getTime()
    }
  })
  .then(function(data) {
    console.log(data);
  })
  .catch(function(e) {
    console.log(e);
  })
  .finally(function() {
    closeConnection();
  });

function closeConnection() {
  require('../sites/daos/mon').close();
}
