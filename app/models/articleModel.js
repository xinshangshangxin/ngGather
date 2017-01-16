'use strict';

var dbService = require('../services/dbService.js');

var article = dbService.define('article', {
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
  }
});


var articleModel = article.model;

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
  if(sites) {
    query.site = {
      $in: sites
    };
  }
  if(updateTime) {
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

  return Promise
    .resolve()
    .then(function() {
      if(!options.keyword) {
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
      if(options.sites) {
        query.site = {
          $in: options.sites
        };
      }
      if(options.startTime && _.isDate(new Date(options.startTime))) {
        query.gatherTime = {
          $gte: new Date(options.startTime).getTime()
        };
      }
      if(options.endTime && _.isDate(new Date(options.endTime))) {
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

    });
}

function remove(title) {
  return articleModel.remove({
    title: title
  });
}

module.exports.search = search;
module.exports.add = add;
module.exports.addArr = addArr;
module.exports.update = update;
module.exports.findOneByHref = findOneByHref;
module.exports.createOrUpdate = createOrUpdate;
module.exports.findLimit = findLimit;
module.exports.remove = remove;
module.exports.articleModel = articleModel; // 为updates抛出
