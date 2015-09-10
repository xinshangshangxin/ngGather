var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var map = require('map-stream');
var events = require('events');
var path = require('path');
var notify = require('gulp-notify');
var series = require('stream-series');
var html2js = require('gulp-html2js');
var less = require('gulp-less');

//var emmitter = new events.EventEmitter();
//var watch = require('gulp-watch');
//var batch = require('gulp-batch');
//var plumber = require('gulp-plumber');
//var rev = require('gulp-rev');
//var uglify = require('gulp-uglify');


var config = require('./tasks/config.js');

//function handleErrors() {
//  var args = Array.prototype.slice.call(arguments);
//  console.log(args);
//
//  // Send error to notification center with gulp-notify
//  notify.onError({
//    message: "<%= error.message %>"
//  }).apply(this, args);
//
//  // Keep gulp from hanging on this task
//  this.emit('end');
//}
//var jsHintErrorReporter = function(file, cb) {
//  return map(function(file, cb) {
//    if (!file.jshint.success) {
//      file.jshint.results.forEach(function(err) {
//        if (err) {
//          //console.log(err);
//          // Error message
//          var msg = [
//            path.basename(file.path),
//            'Line: ' + err.error.line,
//            'Reason: ' + err.error.reason
//          ];
//
//          notify.onError({
//            title: "<%= file.path %>",
//            message: "<%= error.message %>"
//          })
//
//          // Emit this error event
//          //emmitter.emit('error', new Error(msg.join('\n')));
//        }
//      });
//    }
//    cb(null, file);
//  });
//};


function errFun(file) {
  file = file || arguments[0];
  if (file.jshint.success) {
    return false;
  }
  var errors = file.jshint.results.map(function(data) {
    if (data.error) {
      return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
    }
  }).join("\n");
  return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
}


function clean(cb) {
  return del(config.clean.src, cb);
}

function lessDev() {
  return gulp
    .src(config.less.src, config.less.opt)
    .pipe(less({
      expand: true,
      ext: '.css'
    }))
    .pipe(gulp.dest(config.less.dest));
}

function js() {
  return gulp.src(config.js.src, config.js.opt)
    .pipe(cached('js')) // 只传递更改过的文件
    .pipe(jshint('tasks/.jshintrc', {
      fail: true
    }))
    .pipe(jshint.reporter('default')) // Console output
    .pipe(notify(errFun)) // 对这些更改过的文件做一些特殊的处理...
    .pipe(remember('js')) // 把所有的文件放回 stream
    .pipe(gulp.dest(config.js.dest));
}

function htmljs() {
  return gulp.src(config.html2js.src, config.html2js.opt)
    .pipe(html2js(config.html2js.config))
    .pipe(concat(config.html2js.name))
    .pipe(gulp.dest(config.html2js.dest));
}

function vendorJs() {
  return gulp
    .src(
    config.vendorjs.src,
    config.vendorjs.opt
  ).pipe(gulp.dest(config.vendorjs.dest));
}

function vendorCss() {
  return gulp
    .src(
    config.vendorcss.src,
    config.vendorcss.opt
  ).pipe(gulp.dest(config.vendorcss.dest));
}

function vendorOther() {
  return gulp
    .src(
    config.vendorother.src,
    config.vendorother.opt
  ).pipe(gulp.dest(config.vendorother.dest));
}

function otherdependencies() {
  return gulp
    .src(
    config.otherdependencies.src,
    config.otherdependencies.opt
  ).pipe(gulp.dest(config.otherdependencies.dest));
}

function injecHtml() {

  return gulp
    .src(config.inject.src)
    .pipe(
    inject(
      series(config.inject.source.map(function(path) {
        return gulp.src(path, config.inject.opt);
      }))
    ))
    .pipe(gulp.dest(config.inject.dest));
}

function watchAll() {
  var watcher = gulp.watch([
    'static/**/*',
    'sites/**/*.js',
    '!sites/public/**/*',
    '!sites/test/**/*']);
  watcher
    .on('change', function(event) {
      console.info(event.type, event.path);

      if (/\/sites\//.test(event.path)) {
        gulp
          .src(config.sitesjs.src)
          .pipe(jshint('./tasks/.jshintrc_sites', {
            fail: true
          }))
          .pipe(jshint.reporter('default'))
          .pipe(notify(errFun));
      }
      else if (/\/static\//.test(event.path)) {
        if (event.type === 'deleted') { // 如果一个文件被删除了，则将其忘记
          delete cached.caches.js[event.path]; // gulp-cached 的删除 api
          remember.forget('js', event.path); // gulp-remember 的删除 api
        }
        gulp.series(
          clean,
          gulp.parallel(
            otherdependencies,
            vendorJs,
            vendorCss,
            vendorOther,
            js,
            lessDev,
            htmljs
          ),
          injecHtml
        )();
      }
    });
}

gulp.task('default', gulp.series(
  clean,
  gulp.parallel(
    otherdependencies,
    vendorJs,
    vendorCss,
    vendorOther,
    js,
    lessDev,
    htmljs
  ),
  injecHtml,
  watchAll
));