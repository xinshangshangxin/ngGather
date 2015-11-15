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
        templateUrl: 'templates/home.html',
        controller: 'chooseCtrl'
      });
  });