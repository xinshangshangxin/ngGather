'use strict';

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
  href: {                     // 文章详情链接
    type: String
  },
  time: {                     // 文章更新时间
    type: Number,
    default: Date.now
  },
  intro: {                    // 简介
    type: String
  },
  site: {                     // 站点名称
    type: String
  },
  gatherTime: {               // 采集更新时间
    type: Number,
    default: Date.now
  },
  classify: {               // 所属类别: mac & iphone / windows & android / 资讯 & 优惠
    type: String            //          mac / windows / info
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
    this.findOneAndUpdate({}, {createdAt: Date.now()});
  }
  this.findOneAndUpdate({}, {updatedAt: Date.now()});
});

var articleModel = db.model('article', articleSchema);

function add(siteObj) {
  return articleModel.create(siteObj);
}

function addArr(siteArr) {
  return articleModel.collection.insert(siteArr);
}

function findLimit(perPage, pageNu, sites, updateTime) {
  perPage = parseInt(perPage) || 20;   // 每一页多少文章
  pageNu = parseInt(pageNu) || 0;      // 查询第几页的
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
    .find(query, {_id: 0}, {sort: {gatherTime: -1}})
    .skip(pageNu * perPage)
    .limit(perPage);
}

function searchSite(site) {
  return articleModel.find({
    site: site
  }, {
    _id: 0
  });
}

function searchOne(conditions) {
  return articleModel.findOne(conditions || {});
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

exports.searchSite = searchSite;
exports.searchOne = searchOne;
exports.add = add;
exports.addArr = addArr;
exports.update = update;
exports.findOneByHref = findOneByHref;
exports.createOrUpdate = createOrUpdate;
exports.findLimit = findLimit;