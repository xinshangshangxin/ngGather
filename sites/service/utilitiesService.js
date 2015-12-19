'use strict';

var iconv = require('iconv-lite');
var request = require('request');
var Promise = require('bluebird');

var constants = require('./constants.js');

// 中文数字 和 阿拉伯数字 对象
var nuChange = constants.nuChange;
var userAgents = constants.userAgents;
var timeConversion = constants.timeConversion;

var svc = module.exports = {
  getImg: function(req, res) {
    // promise just for catch err
    Promise.resolve()
      .then(function() {
        var url = req.query.imgurl;
        if(!url) {
          return res.status(404).end();
        }
        request(
          {
            url: url,
            pool: false,
            followRedirect: false,
            timeout: 15 * 1000,
            headers: {
              'Connection': 'close',
              'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
            },
            method: 'GET'
          })
          .on('error', function(err) {
            console.log('getImg err:  ', err);
            return res.status(404).end();
          })
          .pipe(res);
      })
      .catch(function(e) {
        console.log(e.stack);
      });
  },
  calculateTime: function(timeStr) {
    var timeNu = 0;

    if(/(\d+[-\/]\d+[-\/]\d+)/.test(timeStr)) {
      return new Date(RegExp.$1.replace(/\-/g, '/')).getTime();
    }
    else if(/(\d+[-\/]\d+)/.test(timeStr)) {
      return svc.calculateTimeWithNoYear(RegExp.$1);
    }

    if(/秒前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * timeConversion.second);
    }
    else if(/分钟前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * timeConversion.minute);
    }
    else if(/小时前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * timeConversion.hour);
    }
    else if(/天前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * timeConversion.day);
    }
    else if(/周前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * timeConversion.week);
    }
    else if(/月前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * timeConversion.month);
    }
    else if(/年前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * timeConversion.year);
    }
    else {
      timeNu = timeStr;
    }
    return new Date(timeNu).getTime();
  },
  calculateTimeWithNoYear: function(timeStr) {
    var today = new Date();
    var calculateTime = new Date(today.getFullYear() + '/' + timeStr);
    if(calculateTime && calculateTime > today) {
      calculateTime.setFullYear(today.getFullYear() - 1);
    }
    return calculateTime.getTime();
  },
  calculateTimeWithChinese: function(timeStr) {
    // 27 九, 2015
    // ["On", "九", "25", "2015"]
    var timeArr = timeStr.split(/,?\s+/);
    if(timeArr[0] === 'On') {
      return new Date(timeArr[3] + '/' + nuChange[timeArr[1]] + '/' + timeArr[2]).getTime();
    }
    return new Date(timeArr[2] + '/' + nuChange[timeArr[1].replace(/\s*月\s*/, '')] + '/' + timeArr[0]).getTime();
  },
  calculateTimeLen: function(millisecond) {
    var arr = [];
    var yearNu = parseInt(millisecond / timeConversion.year);
    if(yearNu >= 1) {
      arr.push(yearNu + ' 年');
      millisecond -= yearNu * timeConversion.year;
    }
    var monthNu = parseInt(millisecond / timeConversion.month);
    if(monthNu >= 1) {
      arr.push(monthNu + ' 月');
      millisecond -= monthNu * timeConversion.month;
    }
    var dayNu = parseInt(millisecond / timeConversion.day);
    if(dayNu >= 1) {
      arr.push(dayNu + ' 天');
      millisecond -= dayNu * timeConversion.day;
    }
    var hourNu = parseInt(millisecond / timeConversion.hour);
    if(hourNu >= 1) {
      arr.push(hourNu + ' 小时');
      millisecond -= hourNu * timeConversion.hour;
    }
    var minuteNu = parseInt(millisecond / timeConversion.minute);
    if(minuteNu >= 1) {
      arr.push(minuteNu + ' 分');
      millisecond -= minuteNu * timeConversion.minute;
    }
    var secondNu = parseInt(millisecond / timeConversion.second);
    if(secondNu >= 1) {
      arr.push(secondNu + ' 秒');
      millisecond -= secondNu * timeConversion.second;
    }
    arr.push(millisecond + ' 毫秒');
    return arr.join('/');
  },
  /**
   * 转换编码
   * @param data  buffer
   * @param [encoding] 编码,默认utf8
   * @param [noCheck]  默认检测编码(gbk)进行转换
   */
  changeEncoding: function(data, encoding, noCheck) {
    var val = iconv.decode(data, encoding || 'utf8');
    if(!noCheck && val.indexOf('�') !== -1) {
      val = iconv.decode(data, 'gbk');
    }
    return val;
  },
  getFewDaysAgo: function(n, startDay) {
    startDay = svc.getZeroDay(startDay);

    if(!n) {
      return startDay;
    }

    var fewDaysAgo = new Date(startDay);
    fewDaysAgo.setDate(startDay.getDate() - n);
    return fewDaysAgo;
  },
  getZeroDay: function(date) {
    date = date ? (new Date(date)) : (new Date());
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
};