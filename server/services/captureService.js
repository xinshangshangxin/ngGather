
'use strict';

var moment = require('moment');
var utilitiesService = require('./utilitiesService.js');
var calculateTime = utilitiesService.calculateTime;

function captureZD($) {
  var list = [];
  var now = new Date();
  $('.wrapper .content-wrap .excerpt li').each(function(i, e) {
    var item = $(e).children('h2').last();
    var title = item.text();
    var link = item.children('a').last().attr('href');
    var img = $(e).children('a').first().children('img').first().attr('src');
    var time = now.getFullYear() + '-' + $(e).children('.info').last().children('.time').last().text();
    var note = $(e).children('.note').last().text();

    if(!title || !link) {
      return;
    }

    list.push({
      img: img,
      title: title,
      href: link,
      time: new Date(time).getTime() + 1000 - i,
      gatherTime: now.getTime() + 1000 - i,
      intro: note
    });
  });
  return list;
}

function captureIQQ($) {
  var list = [];
  var now = new Date();
  $('.tab_box .news-comm-wrap').first().find('.news-comm li').each(function(i, e) {
    var img = 'http://www.iqshw.com/templets/iqshw_new/logo.jpg';
    var oA = $(e).children('a').last();
    var href = oA.attr('href');
    var title = oA.text();
    var time = now.getFullYear() + '-' + $(e).children('span').last().text();
    list.push({
      img: img,
      title: title,
      href: 'http://www.iqshw.com' + href,
      time: new Date(time).getTime() + 1000 - i,
      gatherTime: now.getTime() + 1000 - i,
      intro: title
    });
  });
  return list;
}

function captureLLM($) {
  var list = [];
  var now = new Date();
  $('.content .excerpt').each(function(i, e) {
    var aItem = $(e).find('h2').first().find('a').first();
    var timeStr = $(e).find('.muted').first().text();
    var timeNu = calculateTime(timeStr);
    list.push({
      img: $(e).find('.focus').first().find('img').first().attr('src'),
      title: aItem.attr('title'),
      href: aItem.attr('href'),
      time: timeNu + 1000 - i,
      gatherTime: now.getTime() + 1000 - i,
      intro: $(e).find('.note').text()
    });
  });
  return list;
}

function captureWaitsun($) {
  var list = [];
  var now = new Date();
  $('#content .masonry').first().find('.loop')
    .each(function(i, e) {
      var img = $(e).find('.img-div').first().find('img').first().attr('src');
      var title = $(e).find('.caption').first().find('dt').first().text();
      var href = $(e).find('.caption').first().find('dd').first().find('a').first().attr('href');
      var timeNu = moment().toDate().getTime();
      var intro = $(e).find('.img-div').first().find('a').first().attr('title');

      list.push({
        img: img,
        title: title,
        href: href,
        time: timeNu + 1000 - i,
        gatherTime: now.getTime() + 1000 - i,
        intro: intro
      });
    });
  return list;
}

function captureXclient($) {
  var list = [];
  var now = new Date();
  $('#main')
    .find('.post_list li')
    .each(function(i, e) {
      var img = $(e).find('.lim-icon').first().attr('src');
      var listItemMeta = $(e).find('.info').first();
      var title = listItemMeta.find('h3').first().text();
      var href = $(e).find('a').first().attr('href');
      var time = $(e).find('.date').first().text().replace(/\./gi, '/');
      var timeNu = utilitiesService.calculateTime(time);
      var intro = listItemMeta.find('p').first().text();
      list.push({
        img: img,
        title: title,
        href: href,
        time: timeNu + 1000 - i,
        gatherTime: now.getTime() + 1000 - i,
        intro: intro
      });
    });
  return list;
}

module.exports.captureLLM = captureLLM;
module.exports.allSites = [{
  ischecked: true,
  name: 'waitsun',
  chName: '爱情守望者',
  site: 'waitsun',
  description: '爱情守望者博客以分享，互助和交流为宗旨，分享软件，电影，资源，设计和网络免费资源。',
  classify: 'mac',
  requestConfig: {
    url: 'http://www.waitsun.com/'
  },
  parseConfig: {
    mode: 'css',
    extract_rules: [{
      name: 'articleList',
      expression: captureWaitsun
    }]
  }
}, {
  ischecked: true,
  name: 'zd',
  site: 'zd',
  description: '专注绿软，分享软件、传递最新软件资讯',
  classify: 'windows',
  requestConfig: {
    url: 'http://www.zdfans.com/'
  },
  parseConfig: {
    mode: 'css',
    extract_rules: [{
      name: 'articleList',
      expression: captureZD
    }]
  }
}, {
  ischecked: true,
  name: 'llm',
  site: 'llm',
  description: '浏览迷(原浏览器之家)是一个关注浏览器及软件、IT的科技博客,致力于为广大浏览器爱好者提供一个关注浏览器、交流浏览器、折腾浏览器的专门网站',
  classify: 'info',
  requestConfig: {
    url: 'http://liulanmi.com/'
  },
  parseConfig: {
    mode: 'css',
    extract_rules: [{
      name: 'articleList',
      expression: captureLLM
    }]
  }
}, {
  name: 'iqq',
  url: 'http://www.iqshw.com/',
  site: 'iqq',
  description: '爱Q生活网 - 亮亮\'blog -关注最新QQ活动动态, 掌握QQ第一资讯',
  classify: 'info',
  requestConfig: {
    url: 'http://www.iqshw.com/'
  },
  parseConfig: {
    mode: 'css',
    extract_rules: [{
      name: 'articleList',
      expression: captureIQQ
    }]
  }
}, {
  ischecked: true,
  name: 'xclient',
  site: 'xclient',
  description: '精品MAC应用分享，每天分享大量mac软件，为您提供优质的mac破解软件,免费软件下载服务',
  classify: 'mac',
  pageFun: function(i) {
    return 'http://xclient.info/s/' + i + '/';
  },
  requestConfig: {
    url: 'http://xclient.info/s/'
  },
  parseConfig: {
    mode: 'css',
    extract_rules: [{
      name: 'articleList',
      expression: captureXclient
    }]
  }
}];
