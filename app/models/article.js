'use strict';

/**
 * 1001: db查询失败
 * 1002: 搜索失败
 * 1003: 查询条件keyword缺少
 */

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var cheerio = require('cheerio'); // 类jq操作DOM
var _ = require('lodash');


var mailSendService = require('../service/mailSendService.js');
var articleDao = require('../daos/articleDao.js');
var capture = require('../models/capture.js');
var constants = require('../service/constants.js');
var utilitiesService = require('../service/utilitiesService.js');


// 服务器最新采集时间
var updateTime = 0;

var userAgents = constants.userAgents;
// 服务器采集站点
var allSites = capture.allSites;

// 调试
//allSites = [allSites[0]];

var errSites = []; // 重复出错只发送一封邮件
var errTime = new Date();

var gatherArticles = function(siteInfo, captureFun) {
  return request(
    {
      url: siteInfo.url,
      method: 'GET',
      timeout: 15 * 1000,
      encoding: null,
      headers: {
        'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
      }
    })
    .spread(function(response, body) {
      var $ = cheerio.load(utilitiesService.changeEncoding(body, siteInfo.encoding, siteInfo.noCheck));
      return captureFun($);
    });
};

var updateOrCreatefilter = function(list) {
  return Promise
    .filter(list, function(article) {
      return articleDao
        .findOneByHref(article.href)
        .then(function(docArticle) {
          // 如果不存在此文章, 说明新建文章
          if(!docArticle) {
            return true;
          } // 作者文章更新时间超过23小时, 并且采集时间-文章更新时间 < 10天 的记为 更新文章
          if(article.time - docArticle.time >= 23 * 60 * 60 * 1000 && article.gatherTime - article.time < 10 * 24 * 60 * 60 * 1000) {
            return true;
          } // 图片变更也算进去
          if(article.img !== docArticle.img) {
            console.log('图片变更:', article);
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
  updateTime = new Date();
  captureFun = captureFun || siteInfo.captureFun;
  return gatherArticles(siteInfo, captureFun)
    .then(function(list) {
      return updateOrCreatefilter(list);
    })
    .then(function(list) {
      // 更新或创建文章
      return Promise
        .all(list.map(function(article) {
          article.classify = siteInfo.classify;
          article.site = siteInfo.site;

          // 为采集站点所有内容做特殊处理(update-0.0.2.js)
          if(/page\/\d+/ig.test(siteInfo.url)) {
            if(!article.time) {
              console.log(article);
            }
            article.gatherTime = article.time;
          }

          return articleDao
            .createOrUpdate(article);
        }))
        .then(function() {
          return Promise.resolve('更新站点' + siteInfo.name + '  ' + list.length + ' 篇文章成功 !!');
        })
        .catch(function(e) {
          console.log(e);
          return Promise.reject('更新' + siteInfo.name + ' 文章失败: ');
        });
    });
};

var search = function(req, res) {
  req.query.keyword = req.query.keyword.trim();
  articleDao
    .search(req.query)
    .then(function(data) {
      res.json(data);
    })
    .catch(function(e) {
      console.log(e);
      res.json(400, {
        err: 1002
      });
    });
};

var getSites = function(req, res) {

  if(req.query.keyword) {
    return search(req, res);
  }

  var updateTime = req.query.updateTime;
  // 采集时间15秒超时, 2分钟内只能采集一次, 故加上 1分钟的容错时间
  updateTime = updateTime ? (parseInt(updateTime) + 60 * 1000) : 0;
  articleDao
    .findLimit(req.query.perPage || 20, req.query.pageNu || 0, req.query.sites, updateTime)
    .then(function(data) {
      res.json(data);
    })
    .catch(function(e) {
      console.log(e);
      res.send(400, {
        err: 1001
      });
    });
};

var simpleDiffSites = function(oldErrSites, newErrSites) {
  if(oldErrSites.length !== newErrSites.length) {
    return true;
  }
  return _.some(newErrSites, function(site) {
    return _.findIndex(oldErrSites, function(oldSite) {
        return oldSite.name === site.name;
      }) === -1;
  });
};

var notifyErr = function(results) {
  var errSitesName = [];
  var errResults = [];
  results.forEach(function(result, i) {
    // 最新采集时间
    allSites[i].latesGatherTime = result.isFulfilled() ? new Date() : allSites[i].latesGatherTime;

    // 采集成功
    if(result.isFulfilled()) {
      return console.log(result.value());
    }

    errSitesName.push(allSites[i].name);
    errResults.push({
      name: allSites[i].name,
      reason: result.reason().toString(),
      time: new Date().toLocaleString()
    });
  });

  console.log('errResults: ', errResults);
  // 全部采集成功
  if(!errResults.length) {
    // 发送重新采集成功
    if(errSites.length) {
      errSites.length = 0;
      var timeLen = utilitiesService.calculateTimeLen(new Date().getTime() - errTime);
      return mailSendService
        .sendMail({
          subject: errSitesName.join(', ') + '采集恢复正常',
          html: '<p>' + (new Date().toLocaleString()) + '</p>' + '<p>持续时间: ' + timeLen + '</p>'
        });
    }
    return;
  }
  // 是否 已经发过通知邮件
  var isDiff = simpleDiffSites(errSites, errResults);
  if(!isDiff) {
    return;
  }
  errTime = new Date().getTime();
  // 替换为最新的错误
  errSites = errResults;
  return mailSendService.sendMail({
    subject: errSitesName.join(', ') + '  ' + errResults.length + ' 采集失败',
    html: '<p>' + (new Date().toLocaleString()) + '</p>' + '<p>' +
    errResults.map(function(item) {
      return item.name + '   ' + item.reason;
    }).join('</p><p>') + '</p>'
  });
};

var taskUpdate = function() {

  if(new Date().getTime() - new Date(updateTime).getTime() < 2 * 60 * 1000) {
    console.log('last update in 2 min');
    return;
  }

  Promise
    .settle(allSites.map(function(item) {
      return updateSiteArticles(item);
    }))
    .then(notifyErr)
    .then(function(data) {
      if(data) {
        console.log('发送邮件通知成功');
      }
    })
    .catch(function(e) {
      console.log(e);
    });
};

module.exports.taskUpdate = taskUpdate;
module.exports.getSites = getSites;
module.exports.search = search;
module.exports.updateTime = function() {
  return updateTime;
};
module.exports.allSites = function() {
  return allSites;
};

// for test
module.exports.updateSiteArticles = updateSiteArticles;
