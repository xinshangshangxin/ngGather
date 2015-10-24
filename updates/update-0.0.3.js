'use strict';

/**
 * 据说 ccav软件有后台刷网址, 故删除之
 */

var articleDao = require('../sites/daos/articleDao.js');
var articleModel = articleDao.articleModel;


articleModel
  .update({
    site: /ccav/i
  }, {
    site: 'ccav_no_use'
  }, {
    multi: true
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
