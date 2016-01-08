'use strict';

var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync').create();

var $ = require('gulp-load-plugins')(
  {
    pattern: ['gulp-*', 'del', 'streamqueue']
    //,lazy: false
  });


function changeSrc(src) {
  if(typeof src === 'string') {
    return path.join('**/*', src);
  }
  else {
    return src.map(function(value) {
      return path.join('**/*', value);
    });
  }
}

// global error handler
function errorHandler(error) {
  console.log(error);
  this.end();
}


var gulpConfig = require('./config.js');
var specConfig = null;       // 在环境初始化之后再读取配置
var config = null;
var isBuild = false;         // 是否为 build/prod 环境
var isStatic = false;


/**
 *
 * 特殊需求, 每个项目不同
 *
 */

gulp.task('languages', function(done) {
  if(!isBuild) {
    return done();
  }
  return gulp.src(specConfig.languageJsons.src, specConfig.languageJsons.opt)
    .pipe(gulp.dest(specConfig.languageJsons.dest));
});


gulp.task('injectUserCode', function() {
  if(isBuild) {
    specConfig.injectUserCode.sourceSrc = specConfig.injectUserCode.prodSourceSrc;
    specConfig.injectUserCode.sourceOpt = specConfig.injectUserCode.prodSourceOpt;
  }
  return gulp.src(specConfig.injectUserCode.src, specConfig.injectUserCode.opt)
    .pipe($.inject(
      gulp.src(specConfig.injectUserCode.sourceSrc,
        specConfig.injectUserCode.sourceOpt
      ),
      specConfig.injectUserCode.injectOpt)
    )
    .pipe(gulp.dest(specConfig.injectUserCode.dest));
});

gulp.task('theme', function(done) {
  if(!isBuild) {
    return done();
  }
  return gulp.src(specConfig.theme.src, specConfig.theme.opt)
    .pipe($.cssnano())
    .pipe($.rev())
    .pipe($.rename({extname: '.min.css'}))
    .pipe(gulp.dest(specConfig.theme.dest));

});

gulp.task('userTask', gulp.series('theme', 'injectUserCode', 'languages'));


/**
 * end: 特殊需求
 */


gulp.task('browser-sync', function(done) {
  browserSync.init(config.browsersync.development);
  return done();
});

// no-op = empty function
gulp.task('noop', function() {
});

gulp.task('clean', function(done) {
  return $.del(config.clean.src, done);
});

// 复制 lib css
gulp.task('libCss', function(done) {
  return gulp
    .src(config.libCss.src, config.libCss.opt)
    .pipe(gulp.dest(config.libCss.dest));
});

gulp.task('sass', function() {
  return gulp.src(config.sass.src, config.sass.opt)
    .pipe($.if(isBuild, $.replace(config.sass.subStr, config.sass.newStr)))
    .pipe($.sass())
    .on('error', $.sass.logError)
    .pipe(gulp.dest(config.sass.dest));
});

gulp.task('less', function() {
  return gulp
    .src(config.less.src, config.less.opt)
    .pipe($.less({
      expand: true,
      ext: '.css'
    }))
    .pipe(gulp.dest(config.less.dest));
});

gulp.task('injectHtml:dev', function() {

  var ignorePath = {
    ignorePath: config.injectHtmlDev.ignorePath
  };

  var css = gulp.src(config.injectHtmlDev.cssSoruce, {read: false});

  var libJs = gulp.src(config.libJs.src.map(function(value) {
    return path.join(config.injectHtmlDev.libJsPrefix, value);
  }), {read: false});

  var specJs = gulp.src(config.specJs.src, {read: false});

  var userJs = gulp
    .src(config.injectHtmlDev.jsSource)
    .pipe($.angularFilesort())
    .on('error', errorHandler);

  return gulp
    .src(config.injectHtmlDev.src, config.injectHtmlDev.opt)
    .pipe($.inject(
      $.streamqueue({objectMode: true}, css, libJs, specJs, userJs),
      ignorePath
    ))
    .on('error', errorHandler)
    .pipe(gulp.dest(config.injectHtmlDev.dest));
});

gulp.task('images', function(done) {
  if(!config.images.src || !config.images.src.length) {
    return done();
  }
  return gulp
    .src(config.images.src, config.images.opt)
    .pipe(gulp.dest(config.images.dest))
});

gulp.task('fonts', function(done) {
  if(!config.fonts.src || !config.fonts.src.length) {
    return done();
  }
  return gulp
    .src(config.fonts.src)
    .pipe(gulp.dest(config.fonts.dest))
});


gulp.task('css', function() {

  return gulp.src(config.injectHtmlProd.cssSoruce)
    .pipe($.concat(config.injectHtmlProd.prodCssName))
    .pipe($.cssnano())
    .pipe($.rev())
    .pipe($.rename({extname: '.min.css'}))
    .pipe(gulp.dest(config.injectHtmlProd.cssDest));
});


// jshint 用户的js
gulp.task('js', function() {
  if(!isBuild) {
    return gulp.src(config.js.src, config.js.opt)
      .pipe($.jshint(config.jshintPath))
      .pipe($.jshint.reporter('default'));
  }
  var specStream = gulp.src(config.specJs.src);

  var templateStream = gulp
    .src(config.html2js.src, config.html2js.opt)
    .pipe($.if(config.html2js.isHtmlmin, $.htmlmin(config.htmlminConfig)))
    .pipe($.angularTemplatecache(config.html2js.name, config.html2js.config));


  var stream = gulp.src(config.js.src, config.js.opt);
  var filters = config.js.filters;
  var f;
  for(var i = 0, l = filters.length; i < l; i++) {
    if(!filters[i].src || !filters[i].src.length) {
      continue;
    }
    f = $.filter(changeSrc(filters[i].src), {restore: true});
    stream = stream
      .pipe(f)
      .pipe($.replace(filters[i].subStr, filters[i].newStr))
      .pipe(f.restore);
  }

  //var scriptStream = gulp.src(config.js.src, config.js.opt)
  var scriptStream = stream.pipe($.jshint(config.jshintPath))
    .pipe($.jshint.reporter('default'))
    .pipe($.ngAnnotate())
    .pipe($.angularFilesort())
    .on('error', errorHandler);

  return $.streamqueue({objectMode: true}, specStream, scriptStream, templateStream)
    .pipe($.concat(config.injectHtmlProd.prodUserJsName))
    .pipe($.uglify(config.uglifyConfig))
    .pipe($.rev())
    .pipe($.rename({extname: '.min.js'}))
    .on('error', errorHandler)
    .pipe(gulp.dest(config.js.dest));
});

gulp.task('libJs', function() {

  return gulp.src(config.libJs.src, config.libJs.opt)
    .pipe($.concat(config.injectHtmlProd.prodLibJsName))
    .pipe($.uglify(config.uglifyConfig))
    .pipe($.rev())
    .pipe($.rename({extname: '.min.js'}))
    .on('error', errorHandler)
    .pipe(gulp.dest(config.libJs.dest));
});

gulp.task('injectHtml:prod', function() {
  var injectSource = gulp.src(config.injectHtmlProd.injectSource, {read: false});
  return gulp
    .src(config.injectHtmlProd.src, config.injectHtmlProd.opt)
    .pipe($.inject(injectSource, {
      ignorePath: config.injectHtmlProd.injectIgnorePath
    }))
    .pipe($.if(config.injectHtmlProd.isHtmlmin, $.htmlmin(config.htmlminConfig)))
    .pipe(gulp.dest(config.injectHtmlProd.dest));
});

gulp.task('server', function(done) {
  if(isStatic) {
    return done();
  }
  if(!config.server.src || !config.server.src.length) {
    return done();
  }
  return gulp
    .src(config.server.src, config.server.opt)
    .pipe(gulp.dest(config.server.dest))
});

// start watchers
gulp.task('watchers', function(done) {
  gulp.watch(config.less.watcherPath, gulp.series('less'));
  //gulp.watch(config.images.src, config.images.opt, ['images']);
  //gulp.watch(config.js.src, config.js.opt, ['js', 'injectHtml:dev']);
  done();
});

gulp.task('watchers:sass', function() {
  gulp.watch(config.sass.watcherPath, ['sass']);
});

gulp.task('build', gulp.series(
  function setBuildEnv(done) {
    config = gulpConfig.getCommonConfig();
    specConfig = gulpConfig.getSpecConfig();
    isBuild = true;
    return done();
  },
  'clean',
  'less',
  'userTask',
  gulp
    .parallel(
      'libCss',
      'js',
      'images',
      'fonts',
      'libJs',
      'server'
    ),
  'css',
  'injectHtml:prod'
));

gulp.task('prod', gulp.series('build'));

gulp.task('default', gulp.series(
  function setDevEnv(done) {
    config = gulpConfig.getCommonConfig();
    specConfig = gulpConfig.getSpecConfig();
    return done();
  },
  'clean',
  gulp.parallel(
    'libCss',
    'less',
    'js'
  ),
  'userTask',
  'injectHtml:dev'
));

gulp.task('static', gulp.series(
  function setStaticEnv(done) {
    isStatic = true;
    gulpConfig.alterableSetting.basePath = 'static';
    gulpConfig.alterableSetting.publicPath = gulpConfig.alterableSetting.basePath;
    gulpConfig.alterableSetting.viewPath = gulpConfig.alterableSetting.basePath;
    gulpConfig.alterableSetting.noHtml5Mode = true;
    gulpConfig.alterableSetting.noServer = true;
    return done();
  },
  'build'
));


gulp.task('dev', gulp.series(
  function setDevEnv(done) {
    config = gulpConfig.getCommonConfig();
    specConfig = gulpConfig.getSpecConfig();
    return done();
  },
  'clean',
  gulp.parallel(
    'libCss',
    'less',
    'js'
  ),
  'userTask',
  'injectHtml:dev',
  'browser-sync',
  'watchers'
));

gulp.task('quickStart', gulp.series(
  function setDevEnv(done) {
    config = gulpConfig.getCommonConfig();
    specConfig = gulpConfig.getSpecConfig();
    return done();
  },
  'browser-sync',
  'watchers'
));
