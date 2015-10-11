'use strict';

var utilitiesService = require('../service/utilitiesService.js');
var calculateTime = utilitiesService.calculateTime;
var calculateTimeWithChinese = utilitiesService.calculateTimeWithChinese;



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
      intro: $(e).find('.post-excerpt').text()
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
  $('.content .group .post-inner')
    .each(function(i, e) {
      var temp = $(e).find('.post-thumbnail').first();
      var content = $(e).find('.post-content').first();
      var imgEle = temp.find('a').first().find('img').first();

      var img = imgEle.data('cfsrc') || imgEle.attr('src');
      var title = temp.find('a').first().attr('title');
      var href = temp.find('a').first().attr('href');
      var timeNu = calculateTimeWithChinese(content.find('.post-date').first().text());
      var intro = $(e).find('.excerpt').first().find('p').first().text();

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

function captureMacpeers($) {
  var list = [];
  var now = new Date();
  $('#themepacific_infinite .blogposts-inner')
    .each(function(i, e) {
      var thumb = $(e).find('.magbig-thumb').first().find('a').first();

      var img = thumb.find('img').first().attr('src');
      var title = thumb.attr('title');
      var href = thumb.attr('href');
      var timeNu = calculateTimeWithChinese($(e).find('.post-meta-blog').first().find('.meta_date').first().text().replace('月', ''));
      var intro = title;

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

exports.captureZD = captureZD;
exports.captureIQQ = captureIQQ;
exports.captureCCAV = captureCCAV;
exports.captureLLM = captureLLM;
exports.captureWaitsun = captureWaitsun;
exports.captureMacpeers = captureMacpeers;
