'use strict';

/**
 * 未知原因, 在数据库中存在多个相同 href 的文章,导致findOne找到过时文章
 * 删除相同href文章, 保留最新更新的
 */

var articleDao = require('./daos/articleDao.js');
var articleModel = articleDao.articleModel;
var Promise = require('bluebird');
var _ = require('lodash');


function getAll() {
  return articleModel.find({});
}

function deleteOne(article) {
  return articleModel.remove({
    _id: article._id
  });
}

function deleteSame(articles) {
  articles.sort(function(item1, item2) {
    return item1.time - item2.time;
  });
  articles.pop();
  return Promise.map(articles, function(article) {
    return deleteOne(article);
  });
}

getAll()
  .then(function(articles) {
    var hrefSiteObjs = _.groupBy(articles, function(article) {
      return article.href;
    });
    return _.filter(hrefSiteObjs, function(item) {
      return item.length > 1;
    });
  })
  .then(function(articles) {
    return Promise.map(articles, function(arr) {
      return deleteSame(arr);
    });
  })
  .then(function(data) {
    console.log('删除重复数据: ', data.length);
  })
  .catch(function(e) {
    console.log(e);
  });
