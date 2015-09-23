'use strict';

angular
  .module('ngGather')
  .directive('themeSwitcher', function() {
    return {
      restrict: 'AE',
      template: '<link rel="stylesheet" ng-repeat="style in styles" ng-href="{{ style }}" />',
      replace: true,
      scope: true,
      controller: function($scope, themeService) {
        $scope.styles = themeService.getThemes();
        setTimeout(function(){
          console.log($scope.styles);
        }, 1000);
      }
    };
  });
