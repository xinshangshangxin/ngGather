'use strict';

/**
 * 1001: db查询失败
 * 1002: 搜索失败
 * 1003: 查询条件keyword缺少
 */

var gather = require('gather-site');

var articleModel = require('../models/articleModel.js');
var captureService = require('../services/captureService.js');
var gatherRecordModel = require('../models/gatherRecordModel.js');
var mailSendService = require('../services/mailSendService.js');
var utilitiesService = require('../services/utilitiesService.js');


var myGather = gather.defaults(null, null, {
  urls: [
    null,
    'http://proxy.xinshangshangxin.com/api/v1/proxy/?type=nn&condition=' + encodeURIComponent(JSON.stringify({statusChangeTimes: 0})),
    'http://proxy.xinshangshangxin.com/api/v1/proxy/?type=nt&condition=' + encodeURIComponent(JSON.stringify({statusChangeTimes: 0})),
    'http://proxy.xinshangshangxin.com/api/v1/proxy/?type=wt&condition=' + encodeURIComponent(JSON.stringify({statusChangeTimes: 0})),
    'http://proxy.xinshangshangxin.com/api/v1/proxy/?type=wn&condition=' + encodeURIComponent(JSON.stringify({statusChangeTimes: 0}))
  ],
  time: 60 * 60 * 1000
});

// 服务器最新采集时间
var updateTime = 0;

// 服务器采集站点
var allSites = captureService.allSites;

// 调试
//allSites = [allSites[5]];

var errSites = []; // 重复出错只发送一封邮件
var errTime = new Date();

var updateOrCreatefilter = function(list) {
  return Promise
    .filter(list, function(article) {
      return articleModel
        .findOneByHref(article.href || '')
        .then(function(docArticle) {
          // 如果不存在此文章, 说明新建文章
          if(!docArticle) {
            return true;
          } // 作者文章更新时间超过23小时, 并且采集时间-文章更新时间 < 10天 的记为 更新文章
          if(article.time - docArticle.time >= 23 * 60 * 60 * 1000 && article.gatherTime - article.time < 10 * 24 * 60 * 60 * 1000) {
            return true;
          } // 图片变更也算进去
          if(article.img !== docArticle.img) {
            article.gatherTime = docArticle.gatherTime;
            console.log('图片变更:', article);
            return true;
          }
          return false;
        })
        .catch(function(e) {
          console.log(e && e.stack || e);
          return false;
        });
    });
};

var updateSiteArticles = function(siteInfo) {
  updateTime = new Date();
  return myGather(siteInfo.requestConfig, siteInfo.parseConfig)
    .then(function(data) {
      var list = data.articleList || [];
      if(!list.length) {
        return Promise.reject(new Error('no article gather'));
      }
      return updateOrCreatefilter(list);
    })
    .then(function(list) {
      // 更新或创建文章
      return Promise
        .all(list.map(function(article) {
          article.classify = siteInfo.classify;
          article.site = siteInfo.site;

          // 为采集站点所有内容做特殊处理(update-0.0.2.js)
          if(siteInfo.isUpdate) {
            if(!article.time) {
              console.log(article);
            }
            article.gatherTime = article.time;
          }
          return articleModel.createOrUpdate(article);
        }));
    })
    .then(function(list) {
      return Promise.resolve({
        site: siteInfo.site,
        info: list.length
      });
    })
    .catch(function(e) {
      //console.log(e && e.stack || e);
      return Promise.reject([{
        site: siteInfo.site,
        info: e
      }]);
    });
};

var search = function(req, res) {
  req.query.keyword = req.query.keyword.trim();
  articleModel
    .search(req.query)
    .then(function(data) {
      res.json(data);
    })
    .catch(function(e) {
      console.log(e && e.stack || e);
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
  articleModel
    .findLimit(req.query.perPage || 20, req.query.pageNu || 0, req.query.sites, updateTime)
    .then(function(data) {
      res.json(data);
    })
    .catch(function(e) {
      console.log(e && e.stack || e);
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

var record = function(results) {
  return Promise.map(results, function(result) {
    var data;
    // 采集成功
    if(result.isFulfilled()) {
      data = result.value();
      console.log(data.site + ' 采集 ' + data.info);
      return gatherRecordModel
        .add({
          type: 1,
          site: data.site,
          info: data.info
        });
    }

    data = result.reason();
    console.error(data.site + ' 失败 ', data.info);
    return gatherRecordModel.add({
      type: 2,
      site: data.site,
      info: data.info
    });
  });
};

/* exported notifyErr */
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
    .all(allSites.map(function(item) {
      return updateSiteArticles(item).reflect();
    }))
    .then(record)
    .then(function(data) {
      if(data) {
        console.log('发送邮件通知成功');
      }
    })
    .catch(function(e) {
      console.log(e && e.stack || e);
    });
};

var getSitesStatus = function(req, res) {
  return Promise
    .map(allSites, function(siteInfo) {
      return gatherRecordModel.findLatestStatus(siteInfo.site, 1)
        .then(function(data) {
          var time = data && data.createdAt;
          return {
            name: siteInfo.name,
            chName: siteInfo.chName,
            url: siteInfo.requestConfig.url,
            site: siteInfo.site,
            description: siteInfo.description,
            latesGatherTime: time,
            ischecked: siteInfo.ischecked
          };
        });
    })
    .then(function(data) {
      res.json({
        allSites: data
      });
    });
};

var getStatus = function(req, res) {
  var conditions = utilitiesService.parseJson(req.query.conditions);
  var projection = utilitiesService.parseJson(req.query.projection);
  var options = utilitiesService.parseJson(req.query.options);

  gatherRecordModel
    .find(conditions, projection, options)
    .then(function(data) {
      return res.json(data);
    })
    .catch(function(e) {
      console.log(e && e.stack || e);
      return res.json(400, {
        err: 1001
      });
    });
};


module.exports = {
  taskUpdate: taskUpdate,
  getSites: getSites,
  search: search,
  getSitesStatus: getSitesStatus,
  getStatus: getStatus,
  updateTime: function() {
    return updateTime;
  },
  updateSiteArticles: updateSiteArticles // for test
};



