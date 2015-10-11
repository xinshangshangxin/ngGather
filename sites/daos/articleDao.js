'use strict';

var _ = require('lodash');
var mon = require('./mon');
var db = mon.db;
var mongoose = mon.mongoose;

var articleSchema = new mongoose.Schema({
  img: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  href: { // 文章详情链接
    type: String
  },
  time: { // 文章更新时间
    type: Number,
    default: Date.now
  },
  intro: { // 简介
    type: String
  },
  site: { // 站点名称
    type: String
  },
  gatherTime: { // 采集更新时间
    type: Number,
    default: Date.now
  },
  classify: { // 所属类别: mac & iphone / windows & android / 资讯 & 优惠
    type: String //          mac / windows / info
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date
  }
});

// 更新 updatedAt
articleSchema.pre('save', function() {
  this.updatedAt = Date.now();
});
articleSchema.pre('update', function() {
  this.updatedAt = Date.now();
});
articleSchema.pre('findOneAndUpdate', function() {
  if (!this.createdAt) {
    this.findOneAndUpdate({}, {
      createdAt: Date.now()
    });
  }
  this.findOneAndUpdate({}, {
    updatedAt: Date.now()
  });
});

var articleModel = db.model('article', articleSchema);

function add(siteObj) {
  return articleModel.create(siteObj);
}

function addArr(siteArr) {
  return articleModel.collection.insert(siteArr);
}

function findLimit(perPage, pageNu, sites, updateTime) {
  perPage = parseInt(perPage) || 20; // 每一页多少文章
  pageNu = parseInt(pageNu) || 0; // 查询第几页的
  var query = {};
  if (sites) {
    query.site = {
      $in: sites
    };
  }
  if (updateTime) {
    query.gatherTime = {
      $lte: updateTime
    };
  }
  return articleModel
    .find(query, {
      _id: 0
    }, {
      sort: {
        gatherTime: -1
      }
    })
    .skip(pageNu * perPage)
    .limit(perPage);
}

function update(siteObj) {
  return articleModel.update({
    href: siteObj.href
  }, siteObj);
}

function findOneByHref(href) {
  return articleModel.findOne({
    href: href
  });
}

function createOrUpdate(siteObj) {
  return articleModel.findOneAndUpdate({
    href: siteObj.href
  }, siteObj, {
    upsert: true,
    new: true
  });
}

/**
 * 关键字搜索
 * @param  {[type]} options [{keyword, sites, startTime(以采集时间为准), endTime}]
 * @return {[type]}         [description]
 */
function search(options) {
  if (!options.keyword) {
    return [];
  }

  var perPage = parseInt(options.perPage) || 20; // 每一页多少文章
  var pageNu = parseInt(options.pageNu) || 0; // 查询第几页的
  var keywords = options.keyword.replace(/[(\s+),]/, '.*');
  
  var query = {
    $or: [{
      intro: new RegExp(keywords, 'i')
    }, {
      title: new RegExp(keywords, 'i')
    }]
  };
  if (options.sites) {
    query.site = {
      $in: options.sites
    };
  }
  if (_.isDate(options.startTime)) {
    query.gatherTime = {
      $gte: new Date(options.startTime).getTime()
    };
  }
  if (_.isDate(options.endTime)) {
    query.gatherTime = query.gatherTime || {};
    query.gatherTime.$lte = new Date(options.endTime).getTime();
  }
  return articleModel.find(query, {
      _id: 0
    }, {
      sort: {
        gatherTime: -1
      }
    })
    .skip(pageNu * perPage)
    .limit(perPage);
}

exports.search = search;
exports.add = add;
exports.addArr = addArr;
exports.update = update;
exports.findOneByHref = findOneByHref;
exports.createOrUpdate = createOrUpdate;
exports.findLimit = findLimit;
exports.articleModel = articleModel; // 为updates抛出
