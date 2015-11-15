module.exports = {
  'sitesjs': {
    'src': [
      'sites/**/*.js',
      '!sites/public/**/*',
      '!sites/tests/**/*'
    ]
  },
  'js': {
    'src': [
      '**/*.js',
      '!vendor/**/*',
      '!framework/**/*'
    ],
    'opt': {
      'cwd': 'static',
      'base': 'static'
    },
    'dest': 'sites/public/'
  },
  'less': {
    'src': [
      'styles/**/*.less',
      'themes/**/*.less',
      'components/**/*.less'
    ],
    'opt': {
      'cwd': 'static',
      'base': 'static'
    },
    'dest': 'sites/public'
  },
  'themesCss': {
    'src': [
      'themes/**/*.css'
    ],
    'opt': {
      'cwd': 'sites',
      'base': 'sites'
    },
    'dest': 'sites/public'
  },
  'html2js': {
    'src': [
      '**/*.html',
      '!framework/**/*',
      '!vendor/**/*'
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
    'dest': 'sites/public/js/'
  },
  'inject': {
    'src': [
      'static/index.html'
    ],
    'source': [
      'vendor/angular/**/*.js',
      'vendor/angular-*/**/*.js',
      'vendor/lodash/**/*.js',
      'vendor/*.css',
      'vendor/angular-*/**/*.min.css',
      'vendor/fontawesome/css/font-awesome.min.css',
      'styles/**/*.css',
      'components/**/*.css',
      'js/*.js',
      'languages/**.*.json'
    ],
    'opt': {
      'cwd': 'sites/public',
      'base': 'sites/public',
      'read': 'false'
    },
    'ngSource': [
      '**/*.js',
      '!vendor/**/*',
      '!js/*.js'
    ],
    'ngOpt': {
      'cwd': 'sites/public',
      'base': 'sites/public'
    },
    'dest': 'sites/views'
  },
  'vendorcss': {
    'src': [
      'fontawesome/css/font-awesome.min.css',
      'angular/**/*.csp.css',
      'angular-*/**/*.min.css'
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
      'lodash/**/*.min.js',
      '!angular-bootstrap/ui-bootstrap.min.js'
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
  'frameworkdependencies': {
    'src': ['framework/paper/bootstrap.min.css'],
    'opt': {
      'cwd': 'static'
    },
    'dest': 'sites/public/vendor'
  },
  'otherdependencies': {
    'src': ['languages/**/*.json'],
    'opt': {
      'cwd': 'static',
      'base': 'static'
    },
    'dest': 'sites/public'
  },
  'clean': {
    'src': [
      'sites/public/',
      'sites/views/'
    ]
  },
  'cleanProd': {
    'src': [
      'production'
    ]
  }
};