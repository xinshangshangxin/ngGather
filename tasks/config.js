module.exports = {
  'sitesjs': {
    'src': [
      'sites/**/*.js',
      '!sites/public/**/*',
      '!sites/test/**/*'
    ]
  },
  'js': {
    'src': [
      'app/**/*.js'
    ],
    'opt': {
      'cwd': 'static',
      'base': 'static'
    },
    'dest': 'sites/public/'
  },
  'less': {
    'src': [
      'styles/**/*.less'
    ],
    'opt': {
      'cwd': 'static',
      'base': 'static'
    },
    'dest': 'sites/public'
  },
  'html2js': {
    'src': [
      'app/**/*.html'
    ],
    'opt': {
      'cwd': 'static',
      'base': 'static'
    },
    'config': {
      'outputModuleName': 'ngGather',
      'base': 'static/',
      'useStrict': false
    },
    'name': 'template-app.js',
    'dest': 'sites/public/app/js'
  },
  'inject': {
    'src': [
      'static/index.html'
    ],
    'source': [
      'vendor/angular/**/*.js',
      'vendor/angular-*/**/*.js',
      'vendor/*.css',
      'vendor/lodash/**/*.js',
      'vendor/fontawesome/css/font-awesome.min.css',
      'app/**/*.js',
      'styles/**/*.css',
      '*.js'
    ],
    'opt': {
      'cwd': 'sites/public',
      'base': 'sites/public',
      'read': 'false'
    },
    'dest': 'sites/views'
  },
  'vendorcss': {
    'src': [
      'fontawesome/css/font-awesome.min.css',
      'angular/**/*.csp.css',
      'angular-*/**/*.css'
    ],
    'opt': {
      'cwd': 'static/vendor',
      'base': 'static/vendor'
    },
    'dest': 'sites/public/vendor'
  },
  'vendorjs': {
    'src': [
      'angular/**/*.min.js',
      'angular-*/**/*.min.js',
      'lodash/**/*.min.js'
    ],
    'opt': {
      'cwd': 'static/vendor',
      'base': 'static/vendor'
    },
    'dest': 'sites/public/vendor'
  },
  'vendorother': {
    'src': [
      'angular-*/**/*.min.js.map',
      'angular/**/*.min.js.map',
      'fontawesome/fonts/**/*'
    ],
    'opt': {
      'cwd': 'static/vendor',
      'base': 'static/vendor'
    },
    'dest': 'sites/public/vendor'
  },
  'otherdependencies': {
    'src': 'framework/paper/bootstrap.min.css',
    'opt': {
      'cwd': 'static'
    },
    'dest': 'sites/public/vendor'
  },
  'clean': {
    'src': [
      'sites/public/',
      'sites/views/'
    ]
  }
};