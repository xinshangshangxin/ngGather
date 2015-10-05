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
var notifier = require('node-notifier');
var series = require('stream-series');
var html2js = require('gulp-html2js');
var less = require('gulp-less');
var angularFilesort = require('gulp-angular-filesort');
var ngAnnotate = require('gulp-ng-annotate');


//var emmitter = new events.EventEmitter();
//var watch = require('gulp-watch');
//var batch = require('gulp-batch');
//var plumber = require('gulp-plumber');
//var rev = require('gulp-rev');
//var uglify = require('gulp-uglify');


var config = require('../gulp_config.js');

var myReporter = function() {
  return map(function(file, cb) {
    if (!file.jshint.success) {
      var isFirst = true;
      file.jshint.results.forEach(function(data) {
        if (data.error) {
          console.log(file.path + ': line ' + data.error.line + ', col ' + data.error.character + ', code ' + data.error.code + ', ' + data.error.reason);
          if (isFirst) {
            notifier.notify({
              'title': (data.error.line + ':' + data.error.character + ' ' + data.error.reason),
              'subtitle': file.relative.replace(/.*\//gi, ''),
              'message': ' '
            });
            isFirst = false;
          }
        }
      });
    }
    cb(null, file);
  });
};

function clean(cb) {
  return del(config.clean.src, cb);
}

function cpThemesCss() {
  return gulp
    .src(config.themesCss.src, config.themesCss.opt)
    .pipe(gulp.dest(config.themesCss.dest));
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
    .pipe(jshint('config/.jshintrc', {
      fail: true
    }))
    .pipe(jshint.reporter('default')) // Console output
    .pipe(myReporter()) // 对这些更改过的文件做一些特殊的处理...
    .pipe(remember('js')) // 把所有的文件放回 stream
    .pipe(ngAnnotate())
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

function frameworkdependencies() {
  return gulp
    .src(
      config.frameworkdependencies.src,
      config.frameworkdependencies.opt
    ).pipe(gulp.dest(config.frameworkdependencies.dest));
}

function injecHtml() {
  return gulp
    .src(config.inject.src)
    .pipe(
      inject(
        series(gulp
          .src(config.inject.source, config.inject.opt),
          gulp
          .src(config.inject.ngSource, config.inject.ngOpt)
          .pipe(angularFilesort()))
      ))
    .pipe(gulp.dest(config.inject.dest));
}

function injectUserCode() {
  return gulp.src('js/controllers/choose-ctrl.js', {
      cwd: './static/',
      base: './static'
    })
    .pipe(inject(
      gulp.src(['themes/**/*.css'], {
        read: false,
        cwd: './sites/public'
      }), {
        starttag: '// <!-- inject:themes -->',
        endtag: '// <!-- endinject -->',
        transform: function(filepath) {
          console.log(filepath);
          if (/\/night\//.test(filepath)) {
            return 'themes.push({href: \'' + filepath + '\', disabled: true});';
          }
        }
      }
    ))
    .pipe(gulp.dest('./sites/public/'));
}

function jshintUpdates() {
  return gulp
    .src(['updates/**/*.js'])
    .pipe(jshint('./config/.jshintrc_sites'))
    .pipe(jshint.reporter('default'))
    .pipe(myReporter());
}

function watchAll() {
  var watcher = gulp.watch([
    'static/**/*',
    'sites/**/*.js',
    '!sites/public/**/*',
    '!sites/test/**/*'
  ]);
  watcher
    .on('change', function(event) {
      console.info(event.type, event.path);

      if (/\/sites\//.test(event.path)) {
        gulp
          .src(config.sitesjs.src)
          .pipe(jshint('./config/.jshintrc_sites', {
            fail: true
          }))
          .pipe(jshint.reporter('default'))
          .pipe(myReporter());
      }
      else if (/\/static\//.test(event.path)) {
        if (event.type === 'deleted') { // 如果一个文件被删除了，则将其忘记
          delete cached.caches.js[event.path]; // gulp-cached 的删除 api
          remember.forget('js', event.path); // gulp-remember 的删除 api
        }
        gulp.series(
          clean,
          gulp.parallel(
            cpThemesCss,
            otherdependencies,
            frameworkdependencies,
            vendorJs,
            vendorCss,
            vendorOther,
            js,
            lessDev,
            htmljs
          ),
          injectUserCode,
          injecHtml
        )();
      }
    });
}

gulp.task('default', gulp.series(
  gulp.parallel(clean, jshintUpdates),
  gulp.parallel(
    otherdependencies,
    frameworkdependencies,
    vendorJs,
    vendorCss,
    vendorOther,
    js,
    lessDev,
    htmljs
  ),
  injectUserCode,
  injecHtml,
  watchAll
));
