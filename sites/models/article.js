'use strict';

/**
 * 1001: db查询失败
 *
 */

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var cheerio = require('cheerio'); // 类jq操作DOM

var utilitiesService = require('../service/utilitiesService.js');
var articleDao = require('../daos/articleDao.js');
var capture = require('./capture.js');

// 服务器最新采集时间
var updateTime = 0;

// 服务器采集站点
var allSites = [{
  name: 'waitsun',
  chName: '爱情守望者',
  site: 'waitsun',
  description: '爱情守望者博客以分享，互助和交流为宗旨，分享软件，电影，资源，设计和网络免费资源。',
  url: 'http://www.waitsun.com/',
  captureFun: capture.captureWaitsun,
  classify: 'mac'
}, {
  name: 'MacPeers',
  url: 'http://www.macpeers.com/',
  site: 'MacPeers',
  description: '最有价值的mac软件免费分享源，提供最新mac破解软件免费下载。',
  captureFun: capture.captureMacpeers,
  classify: 'mac',
  encoding: 'utf8',
  noCheck: true
}, {
  name: 'zd',
  url: 'http://www.zdfans.com/',
  site: 'zd',
  description: '专注绿软，分享软件、传递最新软件资讯',
  captureFun: capture.captureZD,
  classify: 'windows'
}, {
  name: 'ccav',
  url: 'http://www.ccav1.com/',
  site: 'ccav',
  description: 'Yanu - 分享优秀、纯净、绿色、实用的精品软件',
  captureFun: capture.captureCCAV,
  classify: 'windows'
}, {
  name: 'llm',
  url: 'http://liulanmi.com/',
  site: 'llm',
  description: '浏览迷(原浏览器之家)是一个关注浏览器及软件、IT的科技博客,致力于为广大浏览器爱好者提供一个关注浏览器、交流浏览器、折腾浏览器的专门网站',
  captureFun: capture.captureLLM,
  classify: 'info'
}, {
  name: 'iqq',
  url: 'http://www.iqshw.com/',
  site: 'iqq',
  description: '爱Q生活网 - 亮亮\'blog -关注最新QQ活动动态, 掌握QQ第一资讯',
  captureFun: capture.captureIQQ,
  classify: 'info'
}];

//// 调试
// var allSites = [{
//   name: 'MacPeers',
//   url: 'http://www.macpeers.com/',
//   description: '最有价值的mac软件免费分享源，提供最新mac破解软件免费下载。',
//   captureFun: capture.captureMacpeers,
//   classify: 'mac',
//   encoding: 'utf8',
//   noCheck: true
// }];
// 
// 

var userAgents = [
  'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36 QQBrowser/3.8.3858.400',
  'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.132 Safari/537.36',
  'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729)'
];

var updateOrCreatefilter = function(list) {
  return Promise
    .filter(list, function(article) {
      return articleDao
        .findOneByHref(article.href)
        .then(function(docArticle) {
          // 如果不存在此文章, 说明新建文章
          if (!docArticle) {
            return true;
          } // 作者文章更新时间超过23小时的记为 更新文章
          if (article.time - docArticle.time >= 23 * 60 * 60 * 1000) {
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
  return request({
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
    })
    .then(function(list) {
      return updateOrCreatefilter(list);
    })
    .then(function(list) {
      // 更新或创建文章
      return Promise
        .all(list.map(function(article) {
          article.classify = siteInfo.classify;
          article.site = siteInfo.site;
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


var getSites = function(req, res) {
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

var taskUpdate = function() {

  if (new Date().getTime() - new Date(updateTime).getTime() < 2 * 60 * 1000) {
    console.log('last update in 2 min');
    return;
  }

  allSites.forEach(function(siteInfo) {
    updateSiteArticles(siteInfo)
      .then(function(data) {
        console.log(data);
      })
      .catch(function(e) {
        console.log(siteInfo.name, e);
      });
  });
};

exports.taskUpdate = taskUpdate;
exports.getSites = getSites;
exports.updateTime = function() {
  return updateTime;
};


//allSites.forEach(function(siteObj) {
//  updateSiteArticles(siteObj);
//});

//function getInfo(req, res) {
//
//}

//function getLatest(req, res) {
//  
//}
