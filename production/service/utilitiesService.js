'use strict';

var iconv = require('iconv-lite');
var request = require('request');


module.exports = {
  getImg: function(req, res) {
    var url = req.query.imgurl;
    if (!url) {
      res.send(404);
    }
    else {
      request({
        url: url,
        pool: false,
        followRedirect: false,
        headers: {'Connection': 'close'},
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
    if (/秒前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * 1000);
    }
    else if (/分钟前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * 60 * 1000);
    }
    else if (/小时前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * 60 * 60 * 1000);
    }
    else if (/天前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * 24 * 60 * 60 * 1000);
    }
    else if (/周前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * 7 * 24 * 60 * 60 * 1000);
    }
    else if (/月前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * 30 * 24 * 60 * 60 * 1000);
    }
    else if (/年前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * 365 * 24 * 60 * 60 * 1000);
    }
    else {
      timeNu = timeStr;
    }
    return new Date(timeNu).getTime();
  },
  /**
   * 转换编码
   * @param data  buffer
   * @param [encoding] 编码,默认utf8
   * @param [noCheck]  默认检测编码(gbk)进行转换
   */
  changeEncoding: function(data, encoding, noCheck) {
    var val = iconv.decode(data, encoding || 'utf8');
    if (!noCheck && val.indexOf('�') !== -1) {
      val = iconv.decode(data, 'gbk');
    }
    return val;
  }
};