'use strict';

angular
  .module('ngGather')
  .directive('themeSwitcher', function() {
    return {
      restrict: 'AE',
      template: '<link rel="stylesheet" ng-repeat="style in styles" ng-href="{{ style.href || style }}" ng-disabled="!!style.disabled"/>',
      replace: true,
      scope: true,
      controller: function($scope, themeSwitcherService) {
        $scope.styles = themeSwitcherService.getThemes();
      }
    };
  });
