'use strict';

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var iconv = require('iconv-lite');
var request = require('request');
var gather = require('gather-site');

var constants = require('./constants.js');

var proxy;
gather
  .proxyPool
  .getProxy({
    urls: ['http://gather-proxy.leanapp.cn/api/v1/combine']
  })
  .then(function(_proxy) {
    console.log('_proxy init');
    proxy = _proxy;
  });


// 中文数字 和 阿拉伯数字 对象
var nuChange = constants.nuChange;
var userAgents = constants.userAgents;
var timeConversion = constants.timeConversion;

var svc = {
  isMongoError: function(err) {
    return err.name === 'MongoError';
  },
  isMongoDuplicateKeyError: function(err) {
    return err.code === 11000 && err.name === 'MongoError';
  },
  spawnAsync: function(option) {
    if(!option) {
      return Promise.reject(new Error('no option'));
    }

    return new Promise(function(resolve, reject) {
      if(option.platform) {
        option.cmd = (process.platform === 'win32' ? (option.cmd + '.cmd') : option.cmd);
      }
      var opt = {stdio: 'inherit'};
      // set ENV
      var env = Object.create(process.env);
      env.NODE_ENV = option.NODE_ENV || process.env.NODE_ENV;
      opt.env = env;

      var cmd = spawn(option.cmd, option.arg, opt);
      cmd.on('error', function(err) {
        console.log(err);
      });
      cmd.on('exit', function(code) {
        if(code !== 0) {
          return reject(code);
        }
        resolve();
      });
    });
  },
  execAsync: function(cmd) {
    return new Promise(function(resolve, reject) {
      exec(cmd, function(error, stdout, stderr) {
        if(error) {
          return reject(error);
        }

        resolve(stdout || stderr);
      });
    });
  },
  getImg: function(req, res, nu) {
    if(!proxy) {
      return res.send(404);
    }

    nu = nu || 0;
    var url = req.query.imgurl;

    // promise just for catch err
    Promise.resolve()
      .then(function() {
        if(!url) {
          return res.send(404);
        }
        return request(
          {
            url: encodeURI(url),
            pool: false,
            followRedirect: false,
            proxy: proxy.get(nu),
            timeout: 15 * 1000,
            headers: {
              'Connection': 'close',
              'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
            },
            method: 'GET'
          })
          .on('error', function(err) {
            console.log('getImg err:  ', err, 'error type: ', nu);
            if(nu >= proxy.proxies.length) {
              if(res.headersSent) {
                console.log('res.headersSent!!!!');
                return;
              }
              return res.sendStatus(400);
            }
            return svc.getImg(req, res, nu + 1);
          })
          .pipe(res);
      })
      .catch(function(e) {
        console.log(e.stack);
      });
  },
  calculateTime: function(timeStr) {
    var timeNu = 0;
    timeStr = timeStr.trim();
    if(/今日更新/.test(timeStr)) {
      return new Date().getTime();
    }
    else if(/^\d+月\d+$/.test(timeStr)) {
      return svc.calculateTimeWithNoYear(timeStr.replace('月', '/'));
    }
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
  },
  parseJson: function(str) {
    if(!_.isString(str)) {
      return str;
    }
    try {
      return JSON.parse(str);
    }
    catch(e) {
      return null;
    }
  }
};

module.exports = svc;