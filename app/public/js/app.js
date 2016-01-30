'use strict';
angular
  .module('ngGather', [
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
    'ngResource',
    'angular-loading-bar',
    'ngAnimate',
    'pc035860.scrollWatch',
    'ngAside'
  ])
  .config(function($locationProvider, $translateProvider) {
    // languages
    $translateProvider.useStaticFilesLoader({
      prefix: 'languages/',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('zh-hans');

    $locationProvider.html5Mode(true);
  });
