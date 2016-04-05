'use strict';

var _ = require('lodash');
var mon = require('./mon');
var db = mon.db;
var mongoose = mon.mongoose;
var Promise = require('bluebird');

var gatherRecordSchema = new mongoose.Schema({
  type: {
    type: mon.Types.Number,   // 0未知  1成功  2错误
    default: 1
  },
  site: {
    type: mon.Types.Mixed
  },
  info: {
    type: mon.Types.Mixed
  },
  createdAt: {
    type: mon.Types.Date,
    default: new Date()
  },
  updatedAt: {
    type: mon.Types.Date
  }
});

gatherRecordSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

gatherRecordSchema.pre('update', function(next) {
  this.updatedAt = new Date();
  next();
});

gatherRecordSchema.pre('findOneAndUpdate', function(next) {
  if(!this.createdAt) {
    this.findOneAndUpdate({}, {
      createdAt: new Date()
    });
  }
  this.findOneAndUpdate({}, {
    updatedAt: new Date()
  });
  next();
});

var gatherRecordModel = db.model('gatherRecord', gatherRecordSchema);

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
