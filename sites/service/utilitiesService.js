'use strict';

var iconv = require('iconv-lite');
var request = require('request');

// 中文数字 和 阿拉伯数字 对象
var nuChange = {
  '零': 0,
  '一': 1,
  '二': 2,
  '三': 3,
  '四': 4,
  '五': 5,
  '六': 6,
  '七': 7,
  '八': 8,
  '九': 9,
  '十': 10,
  '十一': 11,
  '十二': 12
};

var timeConversion = {
  year: 365 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
};


var svc = module.exports = {
  getImg: function(req, res) {
    var url = req.query.imgurl;
    if(!url) {
      res.send(404);
    }
    else {
      request({
        url: url,
        pool: false,
        followRedirect: false,
        headers: {
          'Connection': 'close'
        },
        method: 'GET',
        timeout: 10 * 1000
      })
        .on('error', function(err) {
          console.log('getImg err:  ', err);
          return res.send(404);
        })
        .pipe(res);
    }
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
    return new Date(timeArr[2] + '/' + nuChange[timeArr[1]] + '/' + timeArr[0]).getTime();
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
  }
};
