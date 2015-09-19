'use strict';
angular
  .module('ngGather', [
    'ui.router',
    'ui.bootstrap',
    'ngResource'
  ])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  });