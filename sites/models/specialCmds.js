'use strict';

/**
 * 10001: 执行命令失败
 */

var Promise = require('bluebird');
var spawn = require('child_process').spawn;

var mailSendService = require('../service/mailSendService.js');

var fs = require('fs');
var outFile = fs.openSync('./config/info.log', 'a');
var errFile = fs.openSync('./config/error.log', 'a');

var spawnFileOption = {
  detached: true,
  stdio: ['pipe', outFile, errFile]
};


var allFuns = [{
  name: 'update',
  fun: updateFun
}];

function updateFun(str) {
  if (/update-\d+/.test(str)) {
    return {
      name: str,
      cmd: 'node',
      arg: ['./updates/' + str]
    };
  }
  return null;
}

function execCmds(req, res) {
  var arr = req.body.cmds;

  var isWait = req.body.isWait;
  var email = req.body.email;

  if (!isWait) {
    res.json({
      info: '正在执行中, ' + email ? ('执行结果发送至: ' + email) : '无邮箱提醒'
    });
  }

  Promise
    .all(
      analyseCmd(arr)
      .map(function(item) {
        return execCmd(item);
      })
    )
    .then(function(data) {
      console.log(data);
      if (isWait) {
        res.json(data);
      }
      if (email) {
        return mailSendService.sendMail({
          subject: '成功: 执行ngGather命令',
          html: '<p>' + (new Date().toLocaleString()) + '</p>' + JSON.stringify(data)
        });
      }

    })
    .catch(function(e) {
      console.log(e);
      if (isWait) {
        res.json({
          err: 10001
        });
      }
      if (email) {
        return mailSendService.sendMail({
          subject: '失败: 执行ngGather命令',
          html: '<p>' + (new Date().toLocaleString()) + '</p>' + JSON.stringify(e)
        });
      }
    });
}

function analyseCmd(arr) {
  return arr.map(function(str) {
    for (var i = 0, l = allFuns.length; i < l; i++) {
      var cmd = allFuns[i].fun(str);
      if (cmd) {
        return cmd;
      }
    }
  });
}


function execCmd(option) {
  return new Promise(function(resolve, reject) {
    if (!option) {
      return resolve('no cmd exec');
    }

    var cmd = spawn(option.cmd, option.arg, option.fileOut ? spawnFileOption : undefined);
    var logStr = '[' + option.name + ']  ';

    cmd.on('exit', function(code) {
      if (code !== 0) {
        return reject({
          err: code,
          cmdOption: option
        });
      }
      return resolve({
        err: code,
        cmdOption: option
      });
    });

    // 日志输出
    if (option.fileOut) {
      return;
    }

    cmd.stdout.on('data', function(data) {
      var str = data + '';
      if (/\[\d+:\d+:\d+\]/.test(str)) {
        logStr += str;
      }
      else {
        console.log(logStr + str.replace(/[\r\n]$/, ''));
        logStr = '[' + option.name + ']    ';
      }
    });
    cmd.stdout.on('end', function() {

    });
  });
}



exports.execCmds = execCmds;
exports.getCmds = (function() {
  return allFuns.map(function(item) {
    return item.name;
  });
}());
