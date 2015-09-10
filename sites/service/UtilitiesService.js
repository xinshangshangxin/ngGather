'use strict';

var iconv = require('iconv-lite');    // 解决编码转换模块
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
        method: 'GET',
        timeout: 10 * 1000
      })
        .on('error', function(err) {
          console.log(err);
          res.send(404);
        })
        .pipe(res);
    }
  },
  calculateTime: function(timeStr) {
    var timeNu = 0;
    if (/天前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * 24 * 60 * 60 * 1000);
    }
    else if (/小时前/.test(timeStr)) {
      timeNu = new Date(new Date() - parseInt(timeStr) * 60 * 60 * 1000);
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
  },//  buffer, 编码, 是否需要检测进行转换
  changeEncoding: function(data, encoding, isCheck) {
    var val = iconv.decode(data, encoding || 'utf8');
    if (!isCheck && val.indexOf('�') !== -1) {
      val = iconv.decode(data, 'gbk');
    }
    return val;
  }
};