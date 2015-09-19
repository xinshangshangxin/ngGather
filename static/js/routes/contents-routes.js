'use strict';

angular
  .module('ngGather')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home.contents', {
        url: '/contents',
        templateUrl: 'templates/contents.html',
        controller: 'contentsCtrl'
      });
  });