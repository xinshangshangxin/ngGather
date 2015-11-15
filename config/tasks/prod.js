var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var map = require('map-stream');
var events = require('events');
var path = require('path');
var notifier = require('node-notifier');
var html2js = require('gulp-html2js');
var less = require('gulp-less');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var RevAll = require('gulp-rev-all');
var minifyCSS = require('gulp-minify-css');


var config = require('../gulp_config.js');

var myReporter = function() {
  return map(function(file, cb) {
    if(!file.jshint.success) {
      var isFirst = true;
      file.jshint.results.forEach(function(data) {
        if(data.error) {
          console.log(file.path + ': line ' + data.error.line + ', col ' + data.error.character + ', code ' + data.error.code + ', ' + data.error.reason);
          if(isFirst) {
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


function cleanProd(cb) {
  return del(config.cleanProd.src, cb);
}

function clean(cb) {
  return del(config.clean.src, cb);
}

function prodThemes() {
  var revAll = new RevAll();
  return gulp
    .src(['sites/public/themes/**/*'])
    .pipe(minifyCSS())
    .pipe(revAll.revision())
    .pipe(gulp.dest('production/public/themes'));
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
    .pipe(jshint('config/.jshintrc', {
      fail: true
    }))
    .pipe(jshint.reporter('default')) // Console output
    .pipe(myReporter()) // 对这些更改过的文件做一些特殊的处理...
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
    ).pipe(gulp.dest('production/public'));
}

function frameworkdependencies() {
  return gulp
    .src(
      config.frameworkdependencies.src,
      config.frameworkdependencies.opt
    ).pipe(gulp.dest(config.frameworkdependencies.dest));
}

function injecHtmlProd() {
  return gulp
    .src(['static/index.html'])
    .pipe(inject(
      gulp.src([
        '**/*.css',
        '!themes/**/*',
        'vendor*.js',
        'production*.js'
      ], {
        'cwd': 'production/public/',
        'read': 'false'
      })
    ))
    .pipe(gulp.dest('production/views'));
}

function cpServer() {
  return gulp
    .src(['sites/**/*', '!sites/public/**/*', '!sites/views/**/*'])
    .pipe(gulp.dest('production/'))
}

function prodVendorJs() {
  var revAll = new RevAll();
  return gulp
    .src(['sites/public/vendor/**/*.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(revAll.revision())
    .pipe(gulp.dest('production/public/'));
}

function prodStyles() {
  var revAll = new RevAll();
  return gulp
    .src(['sites/public/vendor/**/*.css', 'sites/public/styles/**/*.css', 'sites/public/components/**/*.css'])
    .pipe(concat('vendor.css'))
    .pipe(minifyCSS())
    .pipe(revAll.revision())
    .pipe(gulp.dest('production/public/'));
}

function prodThemesStyle() {
  var revAll = new RevAll();
  return gulp
    .src(['sites/public/themes/**/*.css'])
    .pipe(minifyCSS())
    .pipe(revAll.revision())
    .pipe(gulp.dest('production/public/themes/'));
}

function prodUserJs() {
  var revAll = new RevAll();
  return gulp
    .src(['sites/public/**/*.js', '!sites/public/vendor/**/*.js'])
    .pipe(concat('production.js'))
    .pipe(uglify({
      compress: {
        drop_console: true
      }
    }))
    .pipe(revAll.revision())
    .pipe(gulp.dest('production/public/'));
}

function prodInjectUserCode() {
  return gulp.src('js/controllers/choose-ctrl.js', {
      cwd: './sites/public',
      base: './sites/public'
    })
    .pipe(inject(
      gulp.src(['themes/**/*.css'], {
        read: false,
        cwd: './production/public'
      }), {
        starttag: '// <!-- inject:themes -->',
        endtag: '// <!-- endinject -->',
        transform: function(filepath) {
          console.log(filepath);
          if(/\/night\//.test(filepath)) {
            return 'themes.push({href: \'' + filepath + '\',disabled: true});';
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

gulp.task('prod', gulp.series(
  gulp.parallel(
    jshintUpdates,
    cleanProd,
    clean
  ),
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
  prodThemes,
  prodInjectUserCode,
  gulp.parallel(
    cpServer,
    prodVendorJs,
    prodUserJs,
    prodStyles
  ),
  injecHtmlProd
));
