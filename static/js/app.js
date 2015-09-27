'use strict';
angular
  .module('ngGather', [
    'ui.router',
    'ui.bootstrap',
    'ngResource',
    'angular-loading-bar',
    'ngAnimate'
  ])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  });
