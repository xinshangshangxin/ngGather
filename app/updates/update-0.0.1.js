'use strict';

/**
 * 采集所有页面
 *
 */

require('../config/globalInit.js');
var articleController = require('../controllers/articleController.js');
var captureService = require('../services/captureService.js');

var gather = require('gather-site');
var sites = captureService.allSites;
var updateSiteArticles = articleController.updateSiteArticles;

var sitesConfig = parseArgs(process.argv.slice(2));


//sites = [sites[5]];

_.forEachRight(sites, function(item, i) {

  var siteConfig = sitesConfig[item.site];
  if(!siteConfig || siteConfig.disabled) {
    sites.splice(i, 1);
    return;
  }

  item.curPage = siteConfig.curPage || 1;
  item.canErrNu = siteConfig.canErrNu || 3;

  item.isUpdate = true;
  item.isErr = false;
});


function parseArgs(args) {
  var defaultConfig = {};
  _.forEach(sites, function(item) {
    defaultConfig[item.site] = {};
  });

  var config;
  try {
    config = JSON.parse(args[0]);
  }
  catch(e) {
  }

  if(_.isObject(config)) {
    _.assign(defaultConfig, config);
  }
  return defaultConfig;
}

// 采集所有页面
function captureAll() {
  sites.forEach(function(item) {
    if(item.pageFun) {
      item.requestConfig.url = item.pageFun(item.curPage);
    }
    else {
      item.requestConfig.url = item.requestConfig.url.replace(/(page\/\d+)+/, '');
      item.requestConfig.url = item.requestConfig.url + 'page/' + item.curPage;
    }
    item.url = item.requestConfig.url;
  });

  return Promise
    .all(sites.map(function(item) {
      return updateSiteArticles(item).reflect();
    }))
    .then(function(results) {
      _.forEachRight(results, function(result, i) {
        if(result.isRejected()) {
          console.log(sites[i].name + '    ' + sites[i].url + '    ' + result.reason());

          sites[i].canErrNu--;
        }
        else {
          console.log(sites[i].name + '    ' + sites[i].url + '    采集成功');

          sites[i].canErrNu = 3;
          sites[i].curPage++;
        }

        if(sites[i].canErrNu < 0) {
          sites.splice(i, 1);
        }
      });
      console.log('---------------------------');
      if(sites.length > 0) {
        captureAll();
      }
      else {
        closeConnection();
      }
    })
    .catch(function(e) {
      console.log(e);
    });
}

function closeConnection() {
  require('../services/dbService').closeMongoose();
  gather.proxyPool.clearUpdateInterval();
}

captureAll();
