'use strict';

angular
  .module('ngGather')
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .when('', '/contents');

    $urlRouterProvider.otherwise('/contents');

    $stateProvider
      .state('home', {
        url: '',
        templateUrl: 'home/home.tpl.html',
        controller: 'chooseCtrl'
      })
      .state('home.contents', {
        url: '/contents',
      });
  });
