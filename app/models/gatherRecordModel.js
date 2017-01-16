'use strict';

var dbService = require('../services/dbService.js');

var gather = dbService.define('gather', {
  type: {
    type: dbService.Types.Number,   // 0未知   1更新时间  2有新增内容 3更新失败
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
    site: site
  };

  if(type) {
    conditions.type = type;
  }

  var options = {
    sort: {
      createdAt: -1
    }
  };

  return gatherRecordModel
    .findOne(conditions, null, options)
    .then(function(data) {
      return data;
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
