'use strict';

var spawn = require('child_process').spawn;
var notifier = require('node-notifier');

var Promise = require('bluebird');
var cmdPromise = Promise.promisify(execCmd);

var gulpCmd = {
  cmd: 'gulp',
  arg: ['default']
};
var serverCmd = {
  cmd: 'supervisor',
  arg: ['-n', 'error', '-i', 'www/public/,www/views/, config/tasks/', 'www/app.js']
};

gulpStart();

cmdPromise(serverCmd)
  .then(function(data) {
    console.log(data);
  })
  .catch(function(e) {
    console.log(e);
  });

function gulpStart() {
  cmdPromise(gulpCmd)
    .then(function(data) {
      console.log(data);
    })
    .catch(function(e) {
      console.log(e);
      notifier.notify({
        title: 'gulp error',
        message: 'restarting'
      });
      gulpStart();
    });
}

function execCmd(option, done) {
  var cmd = spawn(option.cmd, option.arg);
  var timeStr = '';
  cmd.stdout.on('data', function(data) {
    var str = data + '';
    if(/\[\d+:\d+:\d+\]/.test(str)) {
      timeStr = str;
    }
    else {
      console.log(timeStr + str.replace(/[\r\n]$/, ''));
      timeStr = '';
    }
  });
  cmd.stdout.on('end', function(data) {

  });
  cmd.on('exit', function(code) {
    if(code != 0) {
      return done(code);
    }
    done();
  });
}