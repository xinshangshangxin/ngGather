var gatherModule = angular.module('ngGather', ['ui.router']);

gatherModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/index');
  $stateProvider
    .state('index', {
      url: '/index',
      views: {
        '': {
          templateUrl: 'app/tpls/main.html'
        },
        'choosePanel@index': {
          templateUrl: 'app/tpls/choosePanel.html'
        },
        'contents@index': {
          templateUrl: 'app/tpls/contents.html'
        }
      }
    });
}]);
