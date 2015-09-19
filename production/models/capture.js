'use strict';

var calculateTime = require('../service/utilitiesService.js').calculateTime;


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

    list.push({
      img: img,
      title: title,
      href: link,
      time: new Date(time).getTime() + 1000 - i,
      gatherTime: now.getTime() + 1000 - i,
      intro: note,
      site: 'zd'
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
      site: 'iqq',
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

function captureCCAV($) {
  var list = [];
  var now = new Date();

  $('#content-list .post-list').each(function(i, e) {
    var aItem = $(e).find('.post-title').first().find('a').first();
    var img = $(e).find('.post-thumbnail').first().find('img').first();
    var timeStr = $(e).find('.ptime').text();
    var timeNu = calculateTime(timeStr);

    list.push({
      img: img.attr('src'),
      title: aItem.attr('title'),
      href: aItem.attr('href'),
      time: timeNu + 1000 - i, // 通过 + i 来消除sort排序不稳定性
      gatherTime: now.getTime() + 1000 - i,
      intro: $(e).find('.post-excerpt').text(),
      site: 'ccav'
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
      intro: $(e).find('.note').text(),
      site: 'llm'
    });
  });
  return list;
}

exports.captureZD = captureZD;
exports.captureIQQ = captureIQQ;
exports.captureCCAV = captureCCAV;
exports.captureLLM = captureLLM;