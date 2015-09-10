'use strict';

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var cheerio = require('cheerio');    // 类jq操作DOM

var utilitiesService = require('../service/UtilitiesService.js');
var articleDao = require('../daos/articleDao.js');
var capture = require('./capture.js');

// 服务器最新采集时间
//var updateTime = new Date().getTime();

// 服务器采集站点
var allSites = [{
  name: 'zd',
  url: 'http://www.zdfans.com/',
  siteInfo: capture.captureZD,
  classify: 'windows'
}, {
  name: 'ccav',
  url: 'http://www.ccav1.com/',
  siteInfo: capture.captureCCAV,
  classify: 'windows'
}, {
  name: 'llm',
  url: 'http://liulanmi.com/',
  siteInfo: capture.captureLLM,
  classify: 'info'
//}, {
//  name: 'qiuquan',
//  url: 'http://www.qiuquan.cc/',
//  siteInfo: capture.captureLLM,
//  classify: 'stop'
}, {
  name: 'iqq',
  url: 'http://www.iqshw.com/',
  siteInfo: capture.captureIQQ,
  classify: 'info'
}];

//// 调试
//var allSites = [{
//    name: 'iqq',
//    url: 'http://www.iqshw.com/'
//}];

var updateOrCreatefilter = function(list) {
  return Promise
    .filter(list, function(article) {
      return articleDao
        .findOneByHref(article.href)
        .then(function(docArticle) {
          // 如果不存在此文章, 说明新建文章
          if (!docArticle) {
            return true;
          } // 更新文章
          else if (article.time - docArticle.time >= 23 * 60 * 60 * 1000) {
            return true;
          }
          return false;
        })
        .catch(function(e) {
          console.log(e);
          return false;
        });
    });
};

var updateSiteArticles = function(siteInfo, captureFun) {
  captureFun = captureFun || siteInfo.siteInfo;
  return request({
    url: siteInfo.url,
    method: 'GET',
    timeout: 15 * 1000,
    encoding: null
  })
    .spread(function(response, body) {
      var $ = cheerio.load(utilitiesService.changeEncoding(body));
      return captureFun($);
    })
    .then(function(list) {
      return updateOrCreatefilter(list);
    })
    .then(function(list) {
      // 更新或创建文章
      Promise
        .all(list.map(function(article) {
          article.classify = siteInfo.classify;
          return articleDao
            .createOrUpdate(article);
        }))
        .then(function() {
          console.log('更新站点' + siteInfo.name + '  ' + list.length + ' 篇文章成功 !!');
        })
        .catch(function(e) {
          console.log('更新' + siteInfo.name + ' 文章失败: ' + e);
        });
    });
};

console.log(updateSiteArticles, allSites);
//allSites.forEach(function(siteObj) {
//  updateSiteArticles(siteObj);
//});

//function getInfo(req, res) {
//
//}

//function getLatest(req, res) {
//  
//}


