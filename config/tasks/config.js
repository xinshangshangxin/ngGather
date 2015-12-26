'use strict';
var path = require('path');

/****** start: 用户配置***********/

var basePath = 'production/';      // prod 的 基础路径
var publicPath = 'production/public/';
var viewPath = 'production/views/';
var config = {
  clean: {                   // 清除生成文件的路径
    src: [
      basePath,
      'app/public/css/'
    ]
  },
  sass: {
    watcherPath: ['scss/**/*.scss'],    // watch:sass 文件路径
    src: [
      'scss/ionic.app.scss'
    ],
    opt: {},
    subStr: '../lib/ionic/fonts',   // prod环境下 需要替换的fonts路径 scss/ionic.app.scss:19
    newStr: './fonts',            // prod环境下 替换fonts后的路径
    dest: 'app/css'
  },
  less: {
    'src': [
      'styles/**/*.less',
      'themes/**/*.less',
      'components/**/*.less'
    ],
    'opt': {
      'cwd': 'less'
    },
    'dest': 'app/public/css'
  },
  injectHtmlDev: {            // development环境
    src: 'index.html',
    opt: {
      cwd: 'app/views',
      base: 'app/views'
    },
    cssSoruce: [                    // 需要引入的cs
      'app/public/css/bootstrap.min.css',
      'app/public/css/**/*.css',
      '!app/public/css/night/**/*.css'
    ],
    jsSource: [         // 需要引入的js, config.specJs会加载在其上面
      'app/public/**/*.js',
      '!app/public/vendor/**/*',
      '!app/public/framework/**/*'
    ],
    libJsPrefix: 'app/public/vendor',  // libJS  依赖于 config.libJs.src; 需要加上前缀
    ignorePath: 'app/public/',       // 路径去除, 相当于 base
    dest: 'app/views'
  },
  libCss: {             // lib css 需要引入的的css
    src: [              // src 可以为空数组
      'paper/bootstrap.min.css'
    ],
    opt: {
      cwd: 'app/public/framework/'
    },
    dest: 'app/public/css'
  },
  libJs: {              // lib js, 需要按照顺序书写
    'src': [
      'angular/angular.min.js',
      'angular-animate/angular-animate.min.js',
      'angular-resource/angular-resource.min.js',
      'angular-translate/angular-translate.min.js',
      'angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
      'angular-bootstrap/ui-bootstrap.min.js',
      'angular-bootstrap/ui-bootstrap-tpls.min.js',
      'angular-loading-bar/build/loading-bar.min.js',
      'angular-scroll-watch/build/angular-scroll-watch.min.js',
      'angular-ui-router/release/angular-ui-router.min.js',
      'lodash/lodash.min.js'
    ],
    'opt': {
      'cwd': 'app/public/vendor',
      'base': 'app/public/vendor'
    },
    dest: path.join(publicPath, 'js')          // libJs在prod环境下才需要 输出, 故dest为 prod环境的dest
  },
  specJs: {
    src: [                 // 需要引入的且没有依赖项的js,如i18n,  [可以为空数组]
      'app/public/language/**/*.js'
    ]
  },
  js: {                                   // 用户写的 js
    src: [
      '**/*.js',
      '!vendor/**/*'
    ],
    opt: {
      cwd: 'app/public/',
      base: 'app/public/'
    },
    filters: [{
      src: [],
      subStr: '',
      newStr: ''
    }],
    dest: path.join(publicPath, 'js')        // userJs在prod环境下才需要 输出, 故dest为 prod环境的dest
  },
  images: {
    src: [],
    opt: {
      cwd: 'app/public/imgs',
      base: 'app/public'
    },
    dest: publicPath
  },
  fonts: {
    src: [],
    dest: path.join(publicPath, 'fonts')
  },
  injectHtmlProd: {
    src: 'index.html',
    opt: {
      cwd: 'app/views',
      base: 'app/views'
    },
    cssSoruce: [                    // 需要引入的cs
      'app/public/css/bootstrap.min.css',
      'app/public/css/**/*.css',
      '!app/public/css/night/**/*.css'
    ],
    injectSource: [
      path.join(publicPath, 'css/**/*.css'),
      path.join(publicPath, 'js/lib*.min*.js'),
      path.join(publicPath, 'js/user*.min*.js'),
      path.join('!' + publicPath, 'css/night/**/*.css')
    ],
    cssDest: path.join(publicPath, 'css'),
    dest: viewPath,
    injectIgnorePath: publicPath,
    prodCssName: 'production',     // css压缩后的名称(无需写 min.css)
    prodUserJsName: 'user',        // 用户js压缩后的名字(无需写 min.js)
    prodLibJsName: 'lib'         // lib js 压缩后的名字 (无需写 min.js)
  },
  html2js: {
    src: [
      '**/*.html',
      '!index.html'
    ],
    opt: {
      'cwd': 'app/public/',
      'base': 'app/'
    },
    config: {
      module: 'ngGather',
      transformUrl: function(url) {
        return url.replace(/.*\/public\//, '');
      }
    },
    name: 'template-app.js',
    dest: path.join(publicPath, 'js')
  },
  server: {
    src: [
      '**/*',
      '!public/**/*',
      '!views/**/*',
      '!index.html'
    ],
    opt: {
      'cwd': 'app/',
      'base': 'app/'
    },
    dest: basePath
  },
  revAll: {
    src: [
      '**/*',
      '!imagas/**/*',
      '!fonts/**/*',
      '!index.html'
    ],
    opt: {
      'cwd': publicPath,
      'base': publicPath
    },
    dest: publicPath
  },
  minifyCssConfig: {                        // 压缩css配置
    keepSpecialComments: 0
  },
  uglifyConfig: {                           // 压缩js配置
    compress: {
      drop_console: true
    }
  },
  jshintPath: 'config/.jshintrc'                 // jshintrc 的路径, 相对gulpfile.js
};

/****** end: 用户配置***********/


var specConfig = {
  minifyCssConfig: config.minifyCssConfig,
  theme: {
    src: 'css/night/**/*.css',
    opt: {
      cwd: 'app/public',
      base: 'app/public'
    },
    dest: publicPath
  },
  injectUserCode: {
    src: 'js/controllers/choose-ctrl.js',
    opt: {
      cwd: 'app/public',
      base: 'app/public'
    },
    sourceSrc: ['css/night/**/*.css'],
    sourceOpt: {
      read: false,
      cwd: 'app/public/'
    },
    prodSourceSrc: ['css/night/**/*.css'],
    prodSourceOpt: {
      read: false,
      cwd: publicPath
    },
    injectOpt: {
      starttag: '// <!-- inject:themes -->',
      endtag: '// <!-- endinject -->',
      transform: function(filepath) {
        console.log(filepath);
        if(/\/night\//.test(filepath)) {
          return 'themes.push({href: \'' + filepath + '\',disabled: true});';
        }
      }
    },
    dest: 'app/public/'
  }
};

module.exports = {
  commonConfig: config,
  specConfig: specConfig
};