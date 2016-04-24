'use strict';

var dbService = require('../services/dbService.js');

var gather = dbService.define('gather', {
  type: {
    type: dbService.Types.Number,   // 0未知  1成功  2错误
    default: 1
  },
  site: {
    type: dbService.Types.Mixed
  },
  info: {
    type: dbService.Types.Mixed
  }
});

var gatherRecordModel = gather.model;

function add(record) {
  return gatherRecordModel.create(record);
}

function find(conditions, projection, options) {
  if(options === false) {
    options = null;
  }
  else {
    options = _.assign({
      limit: 20,
      sort: {
        createdAt: -1
      }
    }, options);
  }

  return gatherRecordModel.find(conditions, projection, options);
}

function findLatestStatus(site, type) {
  var conditions = {
    site: site,
    type: type || 2
  };

  var options = {
    limit: 1
  };

  return find(conditions, null, options)
    .then(function(data) {
      return data[0];
    });
}

function findSitesStatus(sites, type) {
  return Promise.map(sites, function(site) {
    return findLatestStatus(site, type);
  });
}

module.exports = {
  add: add,
  find: find,
  findLatestStatus: findLatestStatus,
  findSitesStatus: findSitesStatus
};
